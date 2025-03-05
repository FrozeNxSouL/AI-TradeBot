
import { prisma } from "@/lib/prisma_client";
import { LogStatus, UsageStatus } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { account, balance, currency, provider, timeframe } = body.data;
    if (!account || !balance || !currency || !timeframe || !provider) {
        return NextResponse.json({ error: 'Please fill out all required fields' })
    }

    try {
        const exist = await prisma.usage.findFirst({
            include: {
                usage_user: {
                    include: {
                        user_account: true
                    }
                },
                usage_log: true
            },
            where: {
                usage_user: {
                    user_account: {
                        some: {
                            AND: [
                                { acc_name: account },
                                { acc_client: provider }
                            ]
                        }
                    }
                },
                usage_currency: currency,
                usage_timeframe: timeframe,
                usage_log: {
                    some: {
                        log_status: LogStatus.Gethering
                    }
                }
            }
        });
        if (exist) {
            // if (exist.usage_log) {
            //     const log_update = await prisma.tradeLog.update({
            //         where: {
            //             log_id: exist.usage_id
            //         },
            //         data: {
            //             // log_magic: ...log_magic
            //         }
            //     });
            // } else {
            //     const log_update = await prisma.tradeLog.update({
            //         where: {
            //             log_id: exist.usage_id
            //         },
            //         data: {
            //             log_magic: [magic]
            //         }
            //     });

                const updated = await prisma.usage.update({
                    where: {
                        usage_id: exist.usage_id
                    },
                    data: {
                        usage_status: UsageStatus.Active
                    }
                });
            // }
        } else {
            throw Error
        }
    } catch (error) {
        return NextResponse.json({ status: 500 });
    }


    return NextResponse.json({ status: 200 });
}