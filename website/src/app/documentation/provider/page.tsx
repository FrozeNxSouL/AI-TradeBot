"use client"
import { Divider } from "@heroui/divider";
import Image from "next/image";

export default function ProviderDocument() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Trade Providers</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex flex-col w-full justify-end gap-10 text-wrap text-foreground px-24 py-6">
                <h1 className="text-2xl font-semibold">- Installation</h1>
                <p className="text-xl indent-20">
                    Once you download the client site files. Follow these steps to continue.
                </p>
                <div className="flex flex-col gap-2">
                    <p className="text-xl">
                        1. Extract the contents and You should see 2 folders. One for expert advisor and another one is library for
                        the expert advisor.
                    </p>

                    <p className="text-xl">
                        2. Open your MT5 platform.
                    </p>

                    <p className="text-xl">
                        3. Navigate to File {` > `} Open Data Folder.
                    </p>

                    <p className="text-xl">
                        4. Open the MQL5 folder {` > `} Libraries folder.
                    </p>

                    <p className="text-xl">
                        5. Copy the extracted library files to this folder.
                    </p>

                    <p className="text-xl">
                        6. Go Back Navigate to File {` > `} Experts and take Expert Advisor (.ex5) from another folder to Experts folder.
                    </p>

                    <p className="text-xl">
                        7. Restart your MT5 platform.
                    </p>

                    <p className="text-xl">
                        8. After that, allow permission of libraries by select Tools {` > `} Options {` > `} Expert Advisor Tab.
                    </p>
                </div>

                <h1 className="text-2xl font-semibold">- Apply Expert Advisor</h1>
                <div className="flex flex-col gap-2">
                    <p className="text-xl indent-20">
                        To apply expert advisor. Just simply right-click at the expert advisor. Then select "Perform on graph"
                        or just drag and throw on graph that you select in website when you create it.
                    </p>
                    <p className="text-lg font-semibold border-4 rounded-xl border-warning-500 p-2 my-5">
                        # Note. Deploy on correct symbol and timeframe that you select is important. If it incorrect. The expert advisor
                        won't perform for you.
                    </p>
                    <Image
                        src="/advisor.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={500}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                </div>

            </div>
        </div>
    );
}