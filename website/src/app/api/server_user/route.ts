import { NextResponse } from "next/server";
import { PaymentStatus, UsageStatus, UserStatus } from "@/types/types";
import { prisma } from "@/lib/prisma_client";


/**
 * @swagger
 * /server_user:
 *   get:
 *     summary: Return number of late bill to change user status from server schedule
 *     responses:
 *       200:
 *         description: successful response
 *       500:
 *         description: Prisma fail in progress
 */

export async function GET() {
    try {
        const today = new Date();

        const bills = await prisma.billing.findMany({
            select: {
                bill_id: true,
                bill_create_date: true,
                bill_expire_date: true,
                bill_cost: true,
                bill_status: true,
                bill_log: {
                    select: {
                        log_usage: {
                            select: {
                                usage_id: true,
                                usage_currency: true,
                                usage_timeframe: true,
                                usage_account: {
                                    select: {
                                        acc_user: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                bill_status: PaymentStatus.Arrive,
            }
        });

        for (const bill of bills) {
            if (bill.bill_expire_date < new Date()) {

                const expireDate = new Date();
                expireDate.setDate(today.getDate() + 5);

                // Update log_status to 1 (finalized)
                await prisma.billing.update({
                    where: { bill_id: bill.bill_id },
                    data: { bill_status: PaymentStatus.Delay },
                });

                await prisma.user.update({
                    where: {
                        user_id: bill.bill_log.log_usage.usage_account.acc_user.user_id
                    },
                    data: {
                        user_status: UserStatus.Suspend,
                    }
                });

                await prisma.usage.update({
                    where: {
                        usage_id: bill.bill_log.log_usage.usage_id
                    },
                    data: {
                        usage_status: UsageStatus.Inactive,
                    }
                });
            }
        }

        return NextResponse.json({ message: `Processed ${bills.length} billing to User Status.` });
    } catch (error) {
        console.error("Error creating bills:", error);
        return NextResponse.json({ error: "Error creating bills" }, { status: 500 });
    }
}
