"use client"
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {
    BarChart,
    LineChart,
    PieChart
} from 'echarts/charts';
import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo } from 'react';

// Register ECharts components
echarts.use([
    GridComponent,
    TooltipComponent,
    LegendComponent,
    LineChart,
    TitleComponent,
    BarChart,
    PieChart,
    CanvasRenderer
]);

import { UsageWithRelations } from "@/types/types";
import { Divider } from "@heroui/divider";
import { Prisma } from "@prisma/client";
import { EChartsOption } from 'echarts';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Insight() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState<boolean>(true);
    const [fetched, setFetched] = useState<UsageWithRelations[]>([]);

    const calculateUsageStats = (usage: Prisma.UsageGetPayload<{ include: { usage_model: true; usage_log: true } }>): UsageWithRelations => {
        const logs = usage.usage_log;

        // Find the latest trade log where log_status = 0
        const lastLog = logs.find(log => log.log_status === 0);

        // Get the last balance and profit from the latest gathering log
        const lastBalance = lastLog ? lastLog.log_balance : 0;
        const lastProfit = lastLog ? lastLog.log_profit : 0;

        // Calculate all-time profit from all logs
        const alltimeProfit = logs.reduce((sum, log) => sum + log.log_profit, 0);

        return {
            ...usage,
            lastBalance,
            lastProfit,
            alltimeProfit,
        };
    };


    useEffect(() => {
        const fecthData = async () => {
            if (status != "authenticated") {
                return
            }
            try {
                const response = await fetch('/api/dashboard/usage', {
                    method: "POST",
                    body: JSON.stringify({ data: { uid: session?.user.id } })
                });
                if (!response.ok) {
                    throw new Error('Error fetching log');
                }
                const output = await response.json();
                // console.log(output.data.length)
                const converted = Array.isArray(output.data) ? output.data : []
                const processedUsages: UsageWithRelations[] = converted.map(calculateUsageStats);
                setFetched(processedUsages);
                setLoading(false)
            }
            catch (error) {
                console.error('Error fetching log:', error);
            }
        }
        fecthData();
    }, [status]);

    const insights = useMemo(() => {
        if (!fetched || fetched.length === 0) return null;
        const maxLogLength = Math.max(...fetched.map(item => item.usage_log.length));
        const currencyProfitMap = fetched.reduce((acc, item) => {
            const currency = item.usage_currency;
            const totalProfit = item.usage_log.reduce((profitSum, log) => profitSum + (log.log_profit || 0), 0);

            acc[currency] = (acc[currency] || 0) + totalProfit;
            return acc;
        }, {} as Record<string, number>);

        const totalProfit = Object.values(currencyProfitMap).reduce((sum, profit) => sum + profit, 0);

        const chartData = Object.entries(currencyProfitMap).map(([name, value]) => ({
            name,
            value: ((value / totalProfit) * 100).toFixed(2),
            tooltip: {
                valueFormatter: (value: number) => `${value} %`
            }
        }));
        return {
            totalAccounts: fetched.length,
            totalProfit: fetched.reduce((sum, item) => sum + (item.alltimeProfit || 0), 0),
            averageProfit: fetched.reduce((sum, item) => sum + (item.alltimeProfit || 0), 0) / fetched.length,
            currencies: Array.from(new Set(fetched.map(item => item.usage_currency))),
            timeframes: Array.from(new Set(fetched.map(item => item.usage_timeframe))),
            donutData: chartData,
            profitGrowthData: fetched.map(account => {
                const profits = account.usage_log.map(log => log.log_profit);

                // If the account has fewer logs, pad with the last profit value
                const normalizedProfits = Array(maxLogLength).fill(0).map((_, index) => {
                    if (index < profits.length) {
                        return profits[index];
                    }
                    return profits[profits.length - 1] || 0;
                });

                // Calculate cumulative profit growth
                const cumulativeProfits = normalizedProfits.reduce((acc, profit) => {
                    const lastProfit = acc.length > 0 ? acc[acc.length - 1] : 0;
                    acc.push(lastProfit + profit);
                    return acc;
                }, [] as number[]);

                return {
                    accountName: `Account ${account.usage_id || 'Unknown'}`,
                    profits: cumulativeProfits,
                    currency: account.usage_currency
                };
            })
        };
    }, [fetched]);

    const profitLineChartOption = useMemo<EChartsOption>(() => {
        if (!insights || insights?.profitGrowthData.length === 0) return {};

        // Generate x-axis labels dynamically based on the maximum log length
        const maxLogLength = Math.max(...insights.profitGrowthData.map(account => account.profits.length));
        const xAxisLabels = Array.from({ length: maxLogLength }, (_, index) => `Month ${index + 1}`);

        return {
            title: {
                text: 'Cumulative Profit Growth per Account',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: insights.profitGrowthData.map(account => account.accountName),
                top: 'bottom'
            },
            xAxis: {
                type: 'category',
                data: xAxisLabels,
                axisLabel: {
                    show: false // This will hide x-axis labels
                }
            },
            yAxis: {
                type: 'value',
                name: 'Cumulative Profit (USD)'
            },
            series: insights.profitGrowthData.map((account, index) => ({
                name: `${account.accountName} (${account.currency})`,
                type: 'line',
                data: account.profits,
                smooth: true,
                itemStyle: {
                    color: `hsl(${index * 360 / insights.profitGrowthData.length}, 70%, 50%)`
                }
            }))
        };
    }, [fetched, insights]);

    // Currency Distribution Pie Chart
    const currencyDistributionOption = useMemo<EChartsOption | any>(() => {
        if (!insights) return {};

        return {
            title: {
                text: 'Profit Distribution by Currency',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            color: [
                '#26DE29',
                '#F2CC24',
                '#0E28AD',
                '#C7061C',
                '#45E6FF',
                '#E869FF',
                '#FC5D00'
            ],
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                data: insights.donutData
            }]
        };
    }, [fetched]);

    // Render function
    if (!insights) {
        return (
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Insight Analytics</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">presenting key data insights concisely.</p>
                </div>
                <div className="bg-foreground opacity-10 w-full h-48 flex justify-center items-center rounded-lg">
                    <p className="text-2xl text-foreground-300 font-normal capitalize my-28 p-4">No trading data available</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Insight Analytics</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">presenting key data insights concisely.</p>
                </div>
                <div className="flex flex-col items-center w-full px-5 my-10 gap-16">
                    {/* Currency Distribution Pie Chart */}
                    <ReactEChartsCore
                        echarts={echarts}
                        option={currencyDistributionOption}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ height: '400px', width: "100%" }}
                    />
                    {/* Profit Line Chart */}
                    <ReactEChartsCore
                        echarts={echarts}
                        option={profitLineChartOption}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ height: '400px', width: "100%" }}
                    />
                    {/* Performance Summary */}
                    <div className="bg-white shadow rounded-lg p-4 w-full">
                        <h2 className="text-xl text-primary font-bold p-4 rounded-lg bg-foreground opacity-90">Trading Performance Summary</h2>
                        <Divider className="my-4 bg-foreground h-0.5" />
                        <div className="grid grid-cols-3 gap-20 py-3 px-10">
                            <div>

                                <p className="text-md font-medium text-foreground">Total Accounts</p>
                                <Divider className="my-1 bg-foreground" />
                                <p className="text-2xl font-bold text-primary">{insights.totalAccounts}</p>
                            </div>
                            <div>

                                <p className="text-md font-medium text-foreground">Total Profit</p>
                                <Divider className="my-1 bg-foreground" />
                                <p className={`text-2xl font-semibold ${insights.totalProfit >= 0 ? 'text-primary' : 'text-danger'}`}>
                                    {insights.totalProfit.toFixed(2)} $
                                </p>
                            </div>
                            <div>

                                <p className="text-md font-medium text-foreground">Avg. Profit</p>
                                <Divider className="my-1 bg-foreground" />
                                <p className={`text-2xl font-semibold ${insights.averageProfit >= 0 ? 'text-primary' : 'text-danger'}`}>
                                    {insights.averageProfit.toFixed(2)} $
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

