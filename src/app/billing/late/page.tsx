"use client"
import BillCard from "@/components/billing/billCard";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
import { Divider } from "@heroui/divider";

export default function LateBills() {
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Late bills</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">Payment overdue.</p>
                </div>
                <div className="flex flex-col items-center w-full px-5 py-10 gap-5">
                    {/* <BillCard />
                    <BillCard />
                    <BillCard />
                    <BillCard /> */}
                </div>
            </div>
        </>
    );
}