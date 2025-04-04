"use client"
import { Divider } from "@heroui/divider";
import Image from "next/image";

export default function Pricing() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Pricing</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex flex-col w-full justify-end gap-10 text-wrap text-foreground px-24 py-6">
                <p className="text-xl indent-20">
                    Our system calculate cost by ( your profit x system fee percentage ) on monthly update.
                    If your cost is lower than 10 baht. It's mean your cost is FREE in that month.
                    Feel free to use our service.
                </p>

                <h1 className="text-2xl font-semibold">- Payments</h1>
                <div className="flex flex-col gap-5">
                    <p className="text-xl indent-20">
                        Select "Billing" in navigation bar to see all of your payments.
                        You can select specific type of payments in sidebar (
                        Incoming Bills, Late Bills, Bills History )
                    </p>
                    <Image
                        src="/bill.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={700}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />

                    <p className="text-xl">
                        To pay these payments. The website is accept credit card and promptpay.
                    </p>
                    <Image
                        src="/payment.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={400}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    <p className="text-lg font-semibold border-4 rounded-xl border-warning-500 p-2 my-5">
                        # Note. Keep pay before due date is important. If your bill status is late which mean your 
                        expert advisor will suspend. Be careful of that.
                    </p>

                </div>

            </div>
        </div>
    );
}