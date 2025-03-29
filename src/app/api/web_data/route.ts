
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // const body = await request.json();
        // const { id } = body.data;
        // if (!id) {
        //     return NextResponse.json({ error: 'Please fill out all required fields' })
        // }
        const data = await prisma.admin_Data.findFirst()

        if (data) {
            return NextResponse.json(data);
        }
    } catch (error: any) {
        return NextResponse.json({
            message: 'error in admin data',
            error: error.message,
        }, { status: 500 });
    }

}


export async function POST(request: NextRequest) {
    const body = await request.json();
    const { fee } = body.data;
    if (!fee) {
        return NextResponse.json({ error: 'Please fill out all required fields' })
    }
    const admin = await prisma.admin_Data.create({
        data: {
            ad_fee: fee,
        }
    });
    // const admin = await prisma.account.deleteMany();
    if (admin) {
        return NextResponse.json({ status: 200 });
    }
    else {
        return NextResponse.json({ status: 400 });
    }
}
