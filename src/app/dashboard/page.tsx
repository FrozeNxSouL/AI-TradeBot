"use server"
import DashboardCard from "@/components/dashboardCard";
import { Divider } from "@heroui/divider";
import ChartDashboard from "./chart/page";
import Insight from "./insight/page";
import TradeArchive from "./trade_archive/page";

export default async function Dashboard() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Dashboard</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <ChartDashboard />
            <Insight />
            <TradeArchive />
        </div>
    );
}
