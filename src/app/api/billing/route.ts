
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body.data;
        if (!id) {
            return NextResponse.json({ error: 'Please fill out all required fields' })
        }
        const data = await prisma.billing.findMany({
            include: {
                bill_usage: {
                    include: {
                        usage_user: true
                    }
                }
            }, where: {
                bill_usage: {
                    usage_user: {
                        user_id: id
                    }
                }
            }
            // , orderBy: {
            //     bill_status: "asc"
            // }
        })

        if (data) {
            return NextResponse.json(data);
        }
    } catch (error:any) {
        return NextResponse.json({
            message: 'error in billing',
            error: error.message,
        }, { status: 500 });
    }

}
