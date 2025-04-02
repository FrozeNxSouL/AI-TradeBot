import { prisma } from "@/lib/prisma_client";
import { UsageStatus } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid } = body.data;
        if (!uid) {
            return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
        }

        const acc = await prisma.user.findFirst({
            where: {
                user_id: uid,
            }
        });

        if (!acc) {
            return NextResponse.json({ error: 'Database fail to search' }, { status: 500 })
        } else {
            const usage = await prisma.usage.findMany({
                include: {
                    usage_model: true,
                    usage_log: true
                },
                where: {
                    usage_account: {
                        acc_user: {
                            user_id: uid
                        }
                    },
                    OR: [
                        { usage_status: UsageStatus.Active },
                        { usage_status: UsageStatus.Inactive }
                    ]
                }
            });

            if (!usage) {
                return NextResponse.json({ error: 'Database fail to find usage' }, { status: 500 })
            } else {
                return NextResponse.json({ message: "Usage Found", data: usage }, { status: 200 });
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}