"use client"
import { Divider } from "@heroui/divider";
import Image from "next/image";

export default function WebsiteDocument() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Website</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex flex-col w-full justify-end gap-10 text-wrap text-foreground px-24 py-6">
                <h1 className="text-2xl font-semibold">- Monitoring Feedback</h1>
                <p className="text-xl indent-20">
                    After every steps before now, to monitoring feedback of your outcome. Performance, Insight and Trades Log in Dashboard.
                </p>
                <div className="flex flex-col gap-5">
                    <p className="text-xl">
                        Select "Performance Chart" to monitoring outcome include current price, profit and percentage of profit.
                    </p>
                    <Image
                        src="/graph.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={600}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />

                    <p className="text-xl">
                        Select "Insight" for deeply processed information of your account and outcome. These data should help
                        you to analyze the data.
                    </p>
                    <Image
                        src="/insight.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={600}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    <p className="text-xl">
                    Select "Trade Archive" for see trades log of your expert advisor.
                    </p>
                    <Image
                        src="/log.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={600}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    
                </div>

            </div>
        </div>
    );
}