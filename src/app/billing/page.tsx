"use client"
import BillCard from "@/components/billing/billCard";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
import { Divider } from "@heroui/divider";
import IncomingBills from "./incoming/page";
import LateBills from "./late/page";
import HistoryBills from "./history/page";

export default function Billing() {
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-background uppercase pr-20">Billing</p>
                    <Divider className="my-4 bg-background h-0.5" />
                </div>
                <IncomingBills />
                <LateBills />
                <HistoryBills />
            </div>
        </>
    );
}