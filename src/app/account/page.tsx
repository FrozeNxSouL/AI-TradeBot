

import AccountProfileCard from "@/components/account/accountdata";
import { prisma } from "@/lib/prisma_client";
import { serverSession } from "@/lib/serverSession";
import { redirect } from "next/navigation";

export default async function AccountProfile() {
    const session = await serverSession();
    
    if (!session) {
        return <></>
    }
    let userData = await prisma.user.findFirst({
        where: {
            user_email: session?.user?.email
        }
    })
    if (!userData) {
        redirect("/signin");
    }
    userData.user_password = null;
    return (
        <div className="space-y-5">
            <AccountProfileCard userData={userData} />
        </div>
    )
}