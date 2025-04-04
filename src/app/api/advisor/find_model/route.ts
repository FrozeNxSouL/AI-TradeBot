import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

interface Condition {
    model_currency?: string
    model_timeframe?: string
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { currency, timeframe } = body.data;
        // console.log(body.data);

        // Dynamically construct the `where` condition
        const whereCondition: Condition = {};
        if (currency) whereCondition.model_currency = currency;
        if (timeframe) whereCondition.model_timeframe = timeframe;

        const models = await prisma.model.findMany({
            where: Object.keys(whereCondition).length ? whereCondition : undefined,
        });

        return NextResponse.json({ models }, { status: 200 });

    } catch {
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    }
}
