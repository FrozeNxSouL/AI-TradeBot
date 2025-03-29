"use client"
import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
import { Divider } from "@heroui/divider";
import DashboardCard from "@/components/dashboardCard";
import { serverSession } from "@/lib/serverSession";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UsageWithRelations } from "@/types/types";
import { Prisma } from "@prisma/client";

export default function ChartDashboard() {
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
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Performance Chart</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">A visual representation of expert advisor performance.</p>
                </div>

                <div className="flex flex-wrap w-full px-5 py-10 gap-10">
                    {fetched && fetched.map((item, index:number) => (
                        <DashboardCard key={index} input={item}/>
                    ))}
                    
                    {/* <DashboardCard /> */}
                    {/* <DashboardCard /> */}
                </div>
            </div>
        </>
    );
}