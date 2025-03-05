"use client"
import BillCard from "@/components/billing/billCard";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
import { Divider } from "@heroui/divider";

export default function HistoryBills() {
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-background uppercase pr-20">bills history</p>
                    <Divider className="my-4 bg-background h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">settled Bills.</p>
                </div>
                <div className="flex flex-col items-center w-full px-5 py-10 gap-5">
                    <BillCard />
                    <BillCard />
                    <BillCard />
                    <BillCard />
                </div>
            </div>
        </>
    );
}