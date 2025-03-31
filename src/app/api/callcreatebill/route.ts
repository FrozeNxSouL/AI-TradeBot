import { NextRequest, NextResponse } from "next/server";
import { LogStatus, PaymentStatus } from "@/types/types";
import { prisma } from "@/lib/prisma_client";


export async function POST(req: NextRequest) {
    try {
        const today = new Date();

        // Find trade logs where:
        // - log_start_date has shifted to the next month (<= today)
        // - log_status is 0 (gathering)
        const tradeLogs = await prisma.tradeLog.findMany({
            where: {
                log_start_date: { lte: today }, // log_start_date should be in the past or today
                log_status: LogStatus.Gethering, // Gathering status
            }
        });


        // Process each trade log found
        for (const log of tradeLogs) {
            // Calculate bill expiration date (today + 5 days)
            // const nextMonth = new Date(log.log_start_date)
            // nextMonth.setMonth(nextMonth.getMonth() + 1);

            // // If the day changes, adjust to the last day of the new month
            // if (nextMonth.getDate() < new Date().getDate()) {
            //     nextMonth.setDate(0); // Moves to last day of the previous month
            // }
            // if (nextMonth < new Date()) {

            const expireDate = new Date();
            expireDate.setDate(today.getDate() + 5);

            // Update log_status to 1 (finalized)
            await prisma.tradeLog.update({
                where: { log_id: log.log_id },
                data: { log_status: 1 },
            });

            await prisma.tradeLog.create({
                data: {
                    log_usage_id: log.log_usage_id,
                    log_trades: [],
                    log_start_date: new Date()
                }
            });

            const fee = await prisma.admin_Data.findFirst()

            if (fee && (log.log_profit * fee.ad_fee > 10)) {
                await prisma.billing.create({
                    data: {
                        bill_expire_date: expireDate,
                        bill_cost: Math.abs(log.log_profit), // Use the profit from TradeLog
                        bill_log_id: log.log_id, // Associate bill with Usage
                        bill_status: PaymentStatus.Arrive
                    },
                });
            }
            // }
        }

        return NextResponse.json({ message: `Processed ${tradeLogs.length} trade logs for billing.` });
    } catch (error) {
        console.error("Error creating bills:", error);
        return NextResponse.json({ error: "Error creating bills" }, { status: 500 });
    }
}
