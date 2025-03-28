"use client"

import AdvisorCard from "@/components/advisorCard";
import { Divider } from "@heroui/divider";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Advisor() {
    const [usageData, setUsageData] = useState([]);
    const session = useSession()
    useEffect(() => {
        const fetchUsageData = async () => {
            if (session.status != "authenticated") {
                return
            }
            try {
                const res = await fetch("/api/advisor/usage", { method: "POST", body: JSON.stringify({ data: { uid: session.data?.user.id } }) });
                const json = await res.json();
                if (res.ok) {
                    console.log(json.data)
                    setUsageData(json.data);
                } else {
                    console.error("Error fetching usage:", json.error);
                }
            } catch (error) {
                console.error("API error:", error);
            }
        };

        fetchUsageData();
    }, [session.status]);

    return (
        <div className="flex flex-col px-10 py-7 w-full">
        <div className="flex flex-col w-fit">
            <p className="font-bold text-3xl text-foreground uppercase pr-20">Expert Advisors</p>
            <Divider className="my-4 bg-foreground h-0.5" />
        </div>
        <div className="flex w-full px-5 py-10 gap-5">
        {usageData.map((usage:any) => (
                <AdvisorCard
                    key={usage.usage_id}
                    usage={usage}
                />
            ))}
        </div>

    </div>

    );
}
