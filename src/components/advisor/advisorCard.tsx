"use client";
import { UsageForAdvisor, UsageStatus } from "@/types/types";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { useState } from "react";

export default function AdvisorCard({ usage }: { usage: UsageForAdvisor }) {
    const [isSelected, setIsSelected] = useState(usage.usage_status == UsageStatus.Active);
    const [errorMSG, setErrorMSG] = useState<string>("");
    const [lock, setLock] = useState<boolean>(false);
    const toggleStatus = async () => {

        const newStatus = isSelected ? UsageStatus.Inactive : UsageStatus.Active;
        console.log(isSelected, newStatus, usage.usage_id)
        try {
            const res = await fetch("/api/advisor/usage", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usage_id: usage.usage_id, newStatus }),
            });

            const json = await res.json();
            if (res.status == 200) {
                setErrorMSG("")
                setIsSelected(!isSelected);
                setLock(false)
            } else if (res.status == 201) {
                setErrorMSG(json.message)
                setLock(true)
            } else {
                setErrorMSG(json.error)
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const nextMonth = new Date(usage.usage_log[0].log_start_date)
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // If the day changes, adjust to the last day of the new month
    // if (nextMonth.getDate() < new Date().getDate()) {
    //     nextMonth.setDate(0); // Moves to last day of the previous month
    // }

    return (
        <Card className="py-4 w-fit h-fit p-0" radius="sm">
            <CardHeader className="flex w-72 p-0">
                <div className="flex flex-col items-start gap-3 p-6 text-accent bg-foreground w-full">
                    <div className="w-full py-3 px-5 bg-primary rounded-2xl">
                        <p className="font-bold text-large uppercase text-foreground text-end w-full">
                            {usage.usage_currency} - {usage.usage_timeframe}
                        </p>
                    </div>
                    <p className="text-tiny uppercase font-semibold">ID : {usage.usage_id} </p>
                    <p className="text-tiny uppercase font-normal">Start Date : {new Date(usage.usage_collection_date).toLocaleDateString()} </p>
                    <p className="text-tiny uppercase font-normal">Billing Date : {nextMonth.toLocaleDateString()} </p>
                    <p className="text-tiny uppercase font-normal">Account : {usage.usage_account.acc_name || 0} </p>
                </div>
            </CardHeader>
            <CardFooter>
                <div className="flex items-center gap-2">
                    <Switch isSelected={isSelected} onValueChange={toggleStatus} />
                    {lock ? (
                        <p className="text-small text-danger">{errorMSG}</p>
                    ) : (
                        <p className="text-small text-default-500">Status : {isSelected ? "On" : "Off"}</p>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
