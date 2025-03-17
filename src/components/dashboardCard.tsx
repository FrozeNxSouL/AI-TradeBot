"use client"
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import ReactECharts from 'echarts-for-react';

const data = [
    { time: '09:00', price: 151.25 },
    { time: '09:05', price: 151.30 },
    { time: '09:10', price: 151.45 },
    { time: '09:15', price: 151.40 },
    { time: '09:20', price: 151.60 },
    { time: '09:25', price: 151.55 },
    { time: '09:30', price: 151.75 },
    { time: '09:35', price: 151.85 },
    { time: '09:40', price: 151.80 },
    { time: '09:45', price: 152.00 },
    { time: '09:50', price: 152.10 },
    { time: '09:55', price: 152.05 },
    { time: '10:00', price: 152.15 },
];

const times = data.map(item => item.time);
const prices = data.map(item => item.price);

export default function DashboardCard() {
    return (
        <Card isFooterBlurred className="border-none" radius="lg">
            <div className="w-[475px] h-80 bg-foreground pb-14">
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
                                return `
                          <div style="font-size: 12px; padding: 4px;">
                            <div style="font-weight: bold;">Time: ${params[0].name}</div>
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
                                fontSize: 0
                            }
                        },
                        yAxis: {
                            type: 'value',
                            scale: true,
                            axisLabel: {
                                fontSize: 10,
                                formatter: '{value}'
                            }
                        },
                        series: [
                            {
                                data: prices,
                                type: 'line',
                                smooth: true,
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
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 p-0 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 left-1 w-[calc(100%_-_8px)] shadow-small z-10">
                <div className="flex-col items-start p-2 px-6 text-foreground bg-primary w-3/5">
                    <h4 className="font-bold text-md ">USDJPY - M1</h4>
                    <p className="text-tiny uppercase font-bold ">balance</p>
                    <small className="text-sm">collection date</small>
                </div>
                <div className="flex-col items-start p-2 px-6 text-accent bg-foreground w-2/5">
                    <p className="text-tiny uppercase font-bold ">Profit</p>
                    <small className="text-sm">12 $</small>
                    <h4 className="font-bold text-md">Percentage</h4>
                </div>
            </CardFooter>
        </Card>
    );
}

