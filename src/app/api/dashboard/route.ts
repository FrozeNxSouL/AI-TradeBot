
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body.data;
        if (!id) {
            return NextResponse.json({ error: 'Please fill out all required fields' })
        }
        const data = await prisma.tradeLog.findMany({
            include: {
                log_usage: {
                    include: {
                        usage_account: {
                            include: {
                                acc_user: true,
                            }
                        }
                    }
                }
            }, where: {
                log_usage: {
                    usage_account: {
                        acc_user: {
                            user_id: id
                        }
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
    } catch (error: any) {
        return NextResponse.json({
            message: 'error in usage',
            error: error.message,
        }, { status: 500 });
    }

}
