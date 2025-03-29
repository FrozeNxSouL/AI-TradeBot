import { prisma } from "@/lib/prisma_client";
import { LogStatus, PaymentStatus } from "@/types/types";

export default async function createBillsForTradeLogs() {
    try {
        // Get today's date
        const today = new Date();

        // Find trade logs where:
        // - log_start_date has shifted to the next month (<= today)
        // - log_status is 0 (gathering)
        const tradeLogs = await prisma.tradeLog.findMany({
            where: {
                log_start_date: { lte: today }, // log_start_date should be in the past or today
                log_status: LogStatus.Gethering, // Gathering status
            },
            // include: {
            //     log_usage: true, // Include related Usage data
            // },
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

                // Create a new Billing record
                await prisma.billing.create({
                    data: {
                        bill_expire_date: expireDate,
                        bill_cost: Math.abs(log.log_profit), // Use the profit from TradeLog
                        bill_log_id: log.log_id, // Associate bill with Usage
                        bill_status : PaymentStatus.Arrive
                    },
                });

                // Update log_status to 1 (finalized)
                await prisma.tradeLog.update({
                    where: { log_id: log.log_id },
                    data: { log_status: 1 },
                });
            // }
        }

        console.log(`Processed ${tradeLogs.length} trade logs for billing.`);
    } catch (error) {
        console.error("Error creating bills:", error);
    }
}

// Run the function (For development, you can call it manually)
// createBillsForTradeLogs();

// Export for scheduled execution (cron jobs, background tasks)
