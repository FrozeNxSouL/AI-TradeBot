"use client"
import { Divider } from "@heroui/divider";
import Image from "next/image";

export default function EASytem() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Expert Advisor</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex flex-col w-full justify-end gap-10 text-wrap text-foreground px-24 py-6">
                <p className="text-xl indent-20">
                    Expert Advisor is important core of the trading system. You need to create them before trading for
                    integrate these system.
                </p>
                <h1 className="text-2xl font-semibold">- Create Trading Account</h1>
                <div className="flex flex-col gap-5">
                    <p className="text-xl indent-20">
                        At "Advisor", you could see tabs on sidebar. select at "Trading Account" to create account for
                        let the system know your account for trading.
                    </p>
                    <Image
                        src="/account.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={600}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    <p className="text-xl indent-20">
                        Once you select the tab. You should provide your trading account information. Include provider
                        (platform for trading) and your account name.
                    </p>
                </div>

                <h1 className="text-2xl font-semibold">- Create an Expert Advisor</h1>
                <div className="flex flex-col gap-5">
                    <p className="text-xl">
                        Once you have account for trading. Now you can create your expert advisor by select "Advisors Creation"
                        tab in sidebar.
                    </p>
                    <Image
                        src="/create.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={650}
                        height={400}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    <p className="text-xl indent-20">
                        Select currency (symbol) and timeframe for select AI models for trading. Select your trading account.
                        Last important thing is AI models. You can select a model for your desire. Every model have there own character.
                    </p>
                </div>

                <h1 className="text-2xl font-semibold">- Control the Expert Advisor</h1>
                <div className="flex flex-col gap-5">
                    <p className="text-xl">
                        Now you have your own expert advisor. You can turn them on or off depend on your need. But this is
                        just for the website. You need the client site to complete the system.
                    </p>
                    <Image
                        src="/ea.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={700}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    <p className="text-xl indent-20">
                        Select "Download" at the top of "Deployed Advisor" tab. Now you should get client site files.
                        Continue to next steps. See "Trading Provider" tab in this document.
                    </p>

                </div>
            </div>
        </div>
    );
}