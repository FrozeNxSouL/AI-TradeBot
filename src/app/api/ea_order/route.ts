
import { prisma } from "@/lib/prisma_client";
import { LogStatus, TradeHistoryData, UsageStatus } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // console.log(body)
        const { account, balance, currency, provider, timeframe, history } = body.data;
        // console.log(history)
        const formattedData:TradeHistoryData[] = history.map((item: { closeTime: number; }) => ({
            ...item,
            closeTime: new Date(item.closeTime * 1000).toISOString() // Convert to Date and format as ISO
        }));
        

        console.log(typeof formattedData)
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
                let tradelist:any = log_find.log_trades || []
                tradelist.push(...formattedData);
                let sumOfProfit = formattedData.reduce((sum, { profit }) => sum + profit, 0);

                if (log_find.log_balance == 0) {
                    const log_update = await prisma.tradeLog.update({
                        where: {
                            log_id: log_find.log_id
                        },
                        data: {
                            log_trades: tradelist,
                            log_balance: balance,
                            log_profit : log_find.log_profit + sumOfProfit
                        }
                    });
                } else {
                    const log_update = await prisma.tradeLog.update({
                        where: {
                            log_id: log_find.log_id
                        },
                        data: {
                            log_trades: tradelist,
                            log_profit : log_find.log_profit + sumOfProfit
                        }
                    });
                }
            }
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 });
    }
}
