"use client"
import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
import { Divider } from "@heroui/divider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BillCard from "@/components/billing/billCard";
import { PaymentStatus } from "@/types/types";

export default function IncomingBills() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bills, setBills] = useState([]);
    const [fee, setFee] = useState(0);

    useEffect(() => {
        async function fetchData() {
            if (status != "authenticated") {
                return
            }
            try {
                // Reset states
                setLoading(true);
                setError(null);

                const response = await fetch('/api/billing', {
                    method: "POST",
                    body: JSON.stringify({ data: { id: session?.user.id } })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Tiingo');
                }
                // Transform data to match the expected format
                const output = await response.json();
                const filtered = output.billData.filter((bill: any) => bill.bill_status === PaymentStatus.Arrive)
                setBills(filtered);
                setFee(output.fee)
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        }

        fetchData();
    }, [status]);

    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Incoming bills</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                    <p className="text-medium text-foreground-500 capitalize">arriving to make a payment.</p>
                </div>
                <div className="flex flex-col items-center w-full px-5 py-10 gap-5">
                    {bills && status === "authenticated" && bills.length > 0 && bills
                        .map((bill: any) => (
                            <BillCard
                                key={bill.bill_id}
                                input={bill}
                                fee={fee}
                                userID={session.user.id}
                            />
                        ))}

                    {bills && bills.length <= 0 && (
                        <div className="bg-foreground opacity-10 w-full h-48 flex justify-center items-center rounded-lg">
                            <p className="text-2xl text-foreground-300 font-normal">Nothing to Display</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}