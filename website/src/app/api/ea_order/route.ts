
import { prisma } from "@/lib/prisma_client";
import { LogStatus, TradeHistoryData, UsageStatus } from "@/types/types";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /ea_order:
 *   post:
 *     summary: Synchronize the log data for trades log and billing process
 *     responses:
 *       200:
 *         description: successful response and trading client status
 *       500:
 *         description: Prisma fail in progress
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { account, balance, currency, provider, timeframe, history } = body.data;
        // console.log(history)
        const formattedData: TradeHistoryData[] = history.map((item: { closeTime: number; }) => ({
            ...item,
            closeTime: new Date(item.closeTime * 1000).toISOString()
        }));

        const exist = await prisma.usage.findFirst({
            include: {
                usage_account: true,
                // usage_log: true
            },
            where: {
                usage_account: {
                    AND: [
                        { acc_name: account },
                        { acc_client: provider }
                    ]
                },
                usage_status: UsageStatus.Active,
                usage_currency: currency,
                usage_timeframe: timeframe,
            }
        });
        if (exist) {
            const log_find = await prisma.tradeLog.findFirst({

                where: {
                    log_usage_id: exist.usage_id,
                    log_status: LogStatus.Gethering
                },
            });

            if (log_find) {
                const tradelist: TradeHistoryData[] = [...log_find.log_trades as unknown as TradeHistoryData[], ...formattedData];

                const tradelistJson: InputJsonValue[] = tradelist.map((trade) => ({
                    ...trade,
                    closeTime: String(trade.closeTime)
                }));

                const sumOfProfit = formattedData.reduce((sum, { profit }) => sum + profit, 0);

                if (log_find.log_balance == 0) {
                    await prisma.tradeLog.update({
                        where: {
                            log_id: log_find.log_id
                        },
                        data: {
                            log_trades: tradelistJson,
                            log_balance: balance,
                            log_profit: log_find.log_profit + sumOfProfit
                        }
                    });
                } else {
                    await prisma.tradeLog.update({
                        where: {
                            log_id: log_find.log_id
                        },
                        data: {
                            log_trades: tradelistJson,
                            log_profit: log_find.log_profit + sumOfProfit
                        }
                    });
                }
            }
            return NextResponse.json({ advisor_status: UsageStatus.Active, status: 200 });
        } else {
            return NextResponse.json({ advisor_status: UsageStatus.Inactive, status: 200 });
        }
    } catch {
        return NextResponse.json({ advisor_status: UsageStatus.Inactive, status: 500 });
    }
}
