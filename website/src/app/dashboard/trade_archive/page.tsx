"use client"
import HistoryTrades from "@/components/dashboard/historyTable";
import { Divider } from "@heroui/divider";

export default function TradeArchive() {
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Trade Archive</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">Archive of past trading activities and transactions.</p>
                </div>
                <div className="flex flex-col items-center w-full px-5 py-10 gap-5">
                    <HistoryTrades />
                </div>

            </div>
        </>
    );
}