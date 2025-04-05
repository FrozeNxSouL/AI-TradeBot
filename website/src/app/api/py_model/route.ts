
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { path, currency, timeframe, id } = body.data;

    try {
        const findlast = await prisma.model.findFirst({
            where: {
                model_timeframe: timeframe,
                model_currency: currency
            },
            orderBy : {
                model_version : "desc"
            }
        })

        if (!findlast) {

            const insert = await prisma.model.create({
                data: {
                    model_id:id,
                    model_timeframe: timeframe,
                    model_currency: currency,
                    model_version: 1,
                    model_path: path
                }
            })

            if (!insert) {
                return NextResponse.json(
                    { success: false, message: 'Error uploading file' },
                    { status: 500 }
                );
            } else {
                return NextResponse.json({ status: 200 });
            }

        } else {

            const insert = await prisma.model.create({
                data: {
                    model_id:id,
                    model_timeframe: timeframe,
                    model_currency: currency,
                    model_version: findlast.model_version + 1,
                    model_path: path
                }
            })

            if (!insert) {
                return NextResponse.json(
                    { success: false, message: 'Error uploading file' },
                    { status: 500 }
                );
            } else {
                return NextResponse.json({ status: 200 });
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 });
    }
}
