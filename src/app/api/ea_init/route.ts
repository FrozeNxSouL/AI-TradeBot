
import { prisma } from "@/lib/prisma_client";
import { UsageStatus } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { acc_name, acc_client, currency, timeframe } = body.data;
    if (!acc_name || !acc_client || !currency || !timeframe) {
        return NextResponse.json({ error: 'Please fill out all required fields' })
    }
    const exist = await prisma.usage.findFirst({
        include: {
            usage_user: {
                include: {
                    user_account: true
                }
            }
        },
        where: {
            usage_user: {
                user_account: {
                    some: {
                        AND: [
                            { acc_name: acc_name },
                            { acc_client: acc_client }
                        ]
                    }
                }
            }
        }
    });
    if (exist) {
        const updated = await prisma.usage.update({
            where: {
                usage_id: exist.usage_id
            },
            data : {
                usage_status: UsageStatus.Active
            }
        });
    }
    return NextResponse.json({ status: 200 });
}