
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /billing:
 *   post:
 *     summary: Returns all created bill in account result
 *     responses:
 *       200:
 *         description: successful response
 *       400:
 *         description: False Input
 *       500:
 *         description: Prisma fail in progress
 */


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body.data;
        if (!id) {
            return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
        }

        const bills = await prisma.billing.findMany({
            select: {
                bill_id: true,
                bill_create_date: true,
                bill_expire_date: true,
                bill_cost: true,
                bill_status: true,
                bill_log: {
                    select: {
                        log_profit: true,
                        log_balance: true,
                        log_start_date: true,
                        log_trades: true,
                        log_usage: {
                            select: {
                                usage_currency: true,
                                usage_timeframe: true,
                                usage_account: {
                                    select: {
                                        acc_client: true,
                                        acc_name: true,
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                bill_log: {
                    log_usage: {
                        usage_account: {
                            acc_user: {
                                user_id: id
                            }
                        }
                    }
                }
            },
            orderBy: {
                bill_status: "desc"
            }
        });

        const fee = await prisma.admin_Data.findFirst({
            select: {
                ad_fee: true
            }
        })

        if (bills && fee) {
            return NextResponse.json({ message: "Bills fetched", billData: bills, fee: fee.ad_fee }, { status: 200 });
        } else {
            throw new Error("undefined data in bill searching")
        }
    } catch (error) {
        return NextResponse.json({
            message: 'error in billing',
            error: error,
        }, { status: 500 });
    }

}
