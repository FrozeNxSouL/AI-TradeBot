
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // const body = await request.json();
        // const { id } = body.data;
        // if (!id) {
        //     return NextResponse.json({ error: 'Please fill out all required fields' })
        // }
        const data = await prisma.model.findMany()

        if (data) {
            return NextResponse.json(data);
        }
    } catch (error: any) {
        return NextResponse.json({
            message: 'error in get model',
            error: error.message,
        }, { status: 500 });
    }

}
