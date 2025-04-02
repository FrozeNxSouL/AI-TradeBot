import { prisma } from "@/lib/prisma_client";
import { LogStatus, UsageStatus, UserStatus } from "@/types/types";
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
                    usage_log: {
                        where: { log_status: LogStatus.Gethering },
                        select: {
                            log_start_date: true,
                        },
                    },
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
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { usage_id, newStatus } = body;
        if (usage_id == null || newStatus == null) {
            return NextResponse.json({ error: 'Missing usage_id' }, { status: 400 });
        }
        const finduser = await prisma.usage.findFirst({
            select: {
                usage_id: true,
                usage_status: true,
                usage_account: {
                    select: {
                        acc_user: true
                    }
                }
            },
            where: {
                usage_id,
            },
        });
        if (finduser) {
            if (finduser.usage_account.acc_user.user_status != UserStatus.Suspend) {
                const updatedUsage = await prisma.usage.update({
                    where: { usage_id },
                    data: { usage_status: newStatus }
                });
                return NextResponse.json({ message: "Status updated", data: updatedUsage }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Pay the bill before change status", data: finduser.usage_status }, { status: 201 });
            }
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}