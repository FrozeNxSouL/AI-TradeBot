import { prisma } from "@/lib/prisma_client";
import { TradeHistoryData } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /dashboard/tradeslog:
 *   post:
 *     summary: Returns trades history 
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
            return NextResponse.json({ error: "Please fill out all required fields" }, { status: 400 });
        }

        const tradeLogs = await prisma.tradeLog.findMany({
            where: {
                log_usage: {
                    usage_account: {
                        acc_user: {
                            user_id: id
                        }
                    }
                }
            },
            select: {
                log_trades: true 
            }
        });

        const combinedTrades:TradeHistoryData[] = tradeLogs.flatMap(log => log.log_trades as unknown as TradeHistoryData[] || []);

        // Flatten and parse each JSON string inside log_trades
        // const allTrades = tradeLogs
        //     .flatMap(log => log.log_trades) // Flatten the array
        //     .map(tradeStr => {
        //         try {
        //             return JSON.parse(tradeStr); // Parse each JSON string
        //         } catch (error) {
        //             console.error("Error parsing JSON:", tradeStr);
        //             return null;
        //         }
        //     })
        //     .filter(Boolean); // Remove null values if parsing fails

        // Convert array back to JSON string format
        // const combinedTradesString = allTrades.map(trade => JSON.stringify(trade)).join(",");

        return NextResponse.json({ trades: combinedTrades });

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                message: "Error fetching trade logs",
                error: error
            },
            { status: 500 }
        );
    }
}
