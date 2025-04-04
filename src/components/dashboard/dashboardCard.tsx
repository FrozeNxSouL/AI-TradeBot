"use client"
import { TiingoData, UsageWithRelations } from "@/types/types";
import { Card, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";

import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from "react";

export default function DashboardCard({ input }: { input: UsageWithRelations }) {
    const [chartData, setChartData] = useState<TiingoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTiingoData() {
            try {
                // Reset states
                setLoading(true);
                setError(null);


                const response = await fetch('/api/dashboard/pricegraph', {
                    method: "POST",
                    body: JSON.stringify({ data: { timeframe: input.usage_timeframe, currency: input.usage_currency } })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data from API');
                }
                // Transform data to match the expected format
                const transformedData = await response.json();

                setChartData(transformedData);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        }

        // Only fetch if currency is provided
        if (input.usage_currency && input.usage_timeframe) {
            fetchTiingoData();
        }
    }, [input]);

    // If loading, show a loading state
    if (loading) {
        return (
            <Card className="bg-foreground-300 w-[475px] h-96 space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                    <div className="h-96 rounded-lg bg-default-300" />
                </Skeleton>
                <div className="space-y-1.5">
                    <Skeleton className="w-full rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-full rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-full rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                    </Skeleton>
                </div>
            </Card>

        );
    }

    // If error, show error message
    if (error) {
        return <Card><div className="flex justify-center items-center w-[475px] h-96 bg-foreground-300 text-2xl text-background font-normal capitalize">Error: {error}</div></Card>;
    }

    // Extract times and prices for chart
    const times = chartData.map(item => item.time);
    const prices = chartData.map(item => item.price);

    function formatNumber(value: number): string {
        if (value >= 1_000_000) {
            return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + " M"; // Millions
        } else if (value >= 1_000) {
            return (value / 1_000).toFixed(1).replace(/\.0$/, '') + " K"; // Thousands
        } else {
            return value.toFixed(2); // Keep original for smaller numbers
        }
    }

    return (
        <Card isFooterBlurred className="border-none" radius="lg">
            <div className="w-[475px] h-96 bg-foreground pb-14 p-2">
                <ReactECharts
                    option={{
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            borderColor: 'rgba(70, 70, 70, 0.9)',
                            textStyle: {
                                color: '#fff'
                            },
                            formatter: function (params: any) {
                                const dataIndex = params[0].dataIndex;
                                return `
                                    <div style="font-size: 12px; padding: 4px;">
                                        <div style="font-weight: bold;">Time: ${times[dataIndex]}</div>
                                        <div style="color: #26DE29;">Date: ${chartData[dataIndex].date}</div>
                                        <div style="color: #26DE29;">Price: ${params[0].value.toFixed(2)}</div>
                                    </div>
                                `;
                            }
                        },
                        grid: {
                            left: '1%',
                            right: '1%',
                            bottom: '5%',
                            top: '5%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            data: times,
                            axisLabel: {
                                fontSize: 0,
                            }
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            scale: true,
                            axisLabel: {
                                fontSize: 9,
                                formatter: '{value}'
                            }
                        },
                        series: [
                            {
                                data: prices,
                                type: 'line',
                                smooth: false,
                                lineStyle: {
                                    width: 2,
                                    color: '#26DE29'
                                },
                                symbol: 'none',
                                itemStyle: {
                                    color: '#2563eb'
                                },
                                emphasis: {
                                    itemStyle: {
                                        color: '#1d4ed8',
                                        borderColor: '#1d4ed8',
                                        borderWidth: 1
                                    }
                                }
                            }
                        ]
                    }}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                />
            </div>
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 p-0 absolute before:rounded-xl rounded-large bottom-1 left-1 w-[calc(100%_-_8px)] shadow-small h-20 z-10">
                <div className="flex flex-col items-start h-full justify-between p-3 px-6 text-foreground bg-primary w-3/5">
                    <h4 className="font-bold text-lg">{input.usage_currency} - {input.usage_timeframe.toUpperCase()}</h4>
                    <small className="text-sm">Start Date {new Date(input.usage_collection_date).toLocaleDateString()}</small>
                </div>
                <div className="flex flex-col p-3 px-6 items-end justify-between h-full text-accent bg-foreground w-2/5">
                    <Chip color="primary" variant="dot" className="text-background">
                        {prices[prices.length - 1].toFixed(2)}
                    </Chip>
                    {/* <small className="text-sm p-1 m-1 border-1 border-background rounded-2xl"></small> */}
                    <div className="flex justify-between items-baseline w-full">
                        <h4 className="font-bold text-tiny text-background flex gap-1 w-1/3">{(input.alltimeProfit / (input.usage_init_balance || input.lastBalance || 1)).toFixed(2)} <p className="text-primary"> %</p></h4>
                        <h4 className="font-medium text-md text-primary text-end justify-around w-2/3">{formatNumber(input.alltimeProfit)}฿</h4>
                    </div>

                </div>
            </CardFooter>
        </Card>
    );
}