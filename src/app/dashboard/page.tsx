"use server"
import DashboardCard from "@/components/dashboardCard";

export default async function Dashboard() {
    return (
        <>
            <p className="font-bold text-3xl text-background uppercase">Dashboard</p>
            <div className="flex w-full px-5 py-10 gap-5">
                <DashboardCard />
            </div>
        </>
    );
}
