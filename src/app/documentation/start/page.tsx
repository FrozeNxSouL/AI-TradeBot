"use client"
import { Divider } from "@heroui/divider";
import Image from "next/image";

export default function Starting() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Getting Start</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex flex-col w-full justify-end gap-10 text-wrap text-foreground px-24 py-10">
                <h1 className="text-2xl font-semibold">- Register into the system</h1>
                <div className="flex flex-col gap-5">
                    <p className="text-xl indent-20">
                        To getting into this system. First, register for your account in the website by pressing
                    </p>
                    <p className="text-xl">
                        "Sign In" button in navigation bar at the top of your screen.
                    </p>
                    <Image
                        src="/signin.png" // Route to the image file in the public directory
                        alt="Profile picture"
                        width={500}
                        height={300}
                        priority={false} // Set true for important above-the-fold images
                        quality={80} // Optional quality setting (1-100)
                    />
                    <p className="text-xl indent-20">
                        Once you register/login into website. You should see tab for dashboard, advisor and billing. 
                        Also, you can read information about website or documents in website at dropdown of profile or
                        at the footer.
                        This take you into another steps. 
                    </p>
                </div>
            </div>
        </div>
    );
}