

import AccountProfileCard from "@/components/account/accountdata";
import { prisma } from "@/lib/prisma_client";
import { serverSession } from "@/lib/serverSession";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function DataCheck() {

    let userData = await prisma.user.findMany()

    return (
        <div className="flex flex-col text-black px-10 py-12 items-center w-full space-y-5 gap-3">
            <h1>Checking Data</h1>
            <div className="flex flex-col gap-3 w-full flex-wrap overflow-scroll">
                {userData.map((user: User, index: number) => (
                    <p key={index}>{JSON.stringify(user)}</p>
                ))}
            </div>
        </div>
    )
}