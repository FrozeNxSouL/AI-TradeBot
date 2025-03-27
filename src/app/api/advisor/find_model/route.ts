import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { currency, timeframe } = body.data;
        // console.log(body.data);

        // Dynamically construct the `where` condition
        const whereCondition: any = {};
        if (currency) whereCondition.model_currency = currency;
        if (timeframe) whereCondition.model_timeframe = timeframe;

        const models = await prisma.model.findMany({
            where: Object.keys(whereCondition).length ? whereCondition : undefined, 
        });

        return NextResponse.json({ models }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching data", error: error.message }, { status: 500 });
    }
}
