import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); 
        const { uid, mid, aid } = body.data;
        if (!uid || !mid || !aid) {
            return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
        }
        
        const model = await prisma.model.findFirst({
            where: {
                model_id: Number(mid)
            } 
        });
        const acc = await prisma.account.findFirst({
            where: {
                acc_id: Number(aid),
                acc_user_id : String(uid)
            } 
        });

        if (!model || !acc) {
            return NextResponse.json({ error: 'Database fail to search' }, { status: 500 })
        } else {
            const findduplicate = await prisma.usage.findFirst({
                where: {
                    usage_currency: model.model_currency,
                    usage_timeframe : model.model_timeframe,
                    usage_account_id : acc.acc_id,
                    usage_model_id : Number(mid),
                } 
            });

            if (findduplicate) {
                return NextResponse.json({ error: 'Duplicate expert advisor' }, { status: 400 })
            }
            const usage = await prisma.usage.create({
                data: {
                    usage_currency: model.model_currency,
                    usage_timeframe : model.model_timeframe,
                    usage_token : "",
                    usage_account : {
                        connect: {acc_id : acc.acc_id}
                    },
                    usage_model : {
                        connect : {model_id: model.model_id}
                    },
                    usage_collection_date : new Date()
                } 
            });

            if (!usage) {
                return NextResponse.json({ error: 'Database fail to Create Usage' }, { status: 500 })
            } else {
                const log = await prisma.tradeLog.create({
                    data: {
                        log_usage_id: usage.usage_id,
                        log_trades : [],
                        log_start_date : new Date()
                    } 
                });

                if (!log) {
                    return NextResponse.json({ error: 'Database fail to Create log' }, { status: 500 })
                } else {
                    return NextResponse.json({ message: "Advisor Created" }, { status: 200 });
                }
            }
        }
        
    } catch {
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}
