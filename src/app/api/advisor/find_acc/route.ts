import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body.data;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch Account and Model data in parallel
        const accounts = await prisma.account.findMany({
            where: {
                acc_user_id: id
            },
            include: {
                acc_usage: true 
            }
        })

        return NextResponse.json({ accounts }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching data", error: error.message }, { status: 500 });
    }
}
