import { RoleAvailable } from "@/types/types";
import { Divider } from "@heroui/divider";
import HistoryBills from "./history/page";
import IncomingBills from "./incoming/page";
import LateBills from "./late/page";
import { serverSession } from "@/lib/serverSession";
import { redirect } from "next/navigation";

export default async function Billing() {
    const session = await serverSession()
    let currentRole = session?.user.role
    if (currentRole === RoleAvailable.Admin) {
        redirect("/admin");
    } else if (!currentRole) {
        redirect("/");
    }
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Billing</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                </div>
                <IncomingBills />
                <LateBills />
                <HistoryBills />
            </div>
        </>
    );
}