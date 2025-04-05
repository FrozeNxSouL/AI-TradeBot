
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const adminData = await prisma.admin_Data.findFirst();
        return NextResponse.json(adminData || { ad_fee: 0 });
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin data' },
            { status: 500 }
        );
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
