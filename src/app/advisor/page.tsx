"use client"

import AdvisorCard from "@/components/advisor/advisorCard";
import FileDownloader from "@/components/advisor/downloader";
import { RoleAvailable, UsageForAdvisor } from "@/types/types";
import { Divider } from "@heroui/divider";
import { Usage } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Advisor() {
    const [usageData, setUsageData] = useState([]);
    const session = useSession()
    const router = useRouter();
    useEffect(() => {
        const fetchUsageData = async () => {
            if (session.status == "loading") {
                return
            }
            try {
                const currentRole = session.data?.user.role
                if (currentRole === RoleAvailable.Admin) {
                    router.push("/admin");
                } else if (!currentRole) {
                    router.push("/");
                }
            } catch (error) {
                console.log("Redirect error:", error);
            }
        };

        fetchUsageData();
    }, [session.status])

    useEffect(() => {
        const fetchUsageData = async () => {
            if (session.status != "authenticated") {
                return
            }
            try {
                const res = await fetch("/api/advisor/usage", { method: "POST", body: JSON.stringify({ data: { uid: session.data?.user.id } }) });
                const json = await res.json();
                if (res.ok) {
                    setUsageData(json.data);
                } else {
                    console.log("Error fetching usage:", json.error);
                }
            } catch (error) {
                console.log("API error:", error);
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
            <div className="flex justify-end w-full">

                <FileDownloader />
            </div>
            <div className="grid grid-cols-3 w-full px-5 py-10 gap-5">
                {usageData.map((usage: UsageForAdvisor) => (
                    <AdvisorCard
                        key={usage.usage_id}
                        usage={usage}
                    />
                ))}
            </div>

        </div>

    );
}
