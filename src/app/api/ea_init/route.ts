
import { prisma } from "@/lib/prisma_client";
import { LogStatus, UsageStatus } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { account, balance, currency, provider, timeframe } = body.data;

        const exist = await prisma.usage.findFirst({
            include: {
                usage_account: true,
                usage_model: true
            },
            where: {
                usage_account: {
                    acc_name: account ,
                    acc_client: provider
                },
                usage_currency: currency,
                usage_timeframe: timeframe,
            }
        });

        if (exist) {
            const log_find = await prisma.tradeLog.findFirst({
                where: {
                    log_usage_id: exist.usage_id,
                    log_balance : 0,
                    log_status: LogStatus.Gethering
                },
            });
            
            if (log_find) {
                const log_update = await prisma.tradeLog.update({
                    where: {
                        log_id: log_find?.log_id
                    },
                    data: {
                        log_balance : balance
                    }
                });
            } 

            if (exist.usage_init_balance == 0) {
                const updated = await prisma.usage.update({
                    where: {
                        usage_id: exist.usage_id
                    },
                    data: {
                        usage_status: UsageStatus.Active,
                        usage_init_balance : balance
                    }
                });
            } else {
                const updated = await prisma.usage.update({
                    where: {
                        usage_id: exist.usage_id
                    },
                    data: {
                        usage_status: UsageStatus.Active,
                    }
                });
            }
            return NextResponse.json({ modelID: exist.usage_model.model_id, status: 200 });
        } else {
            return NextResponse.json({ status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ status: 500 });
    }
}