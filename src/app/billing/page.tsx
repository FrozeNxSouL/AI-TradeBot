import { RoleAvailable } from "@/types/types";
import { routeProtection } from "@/utils/functions";
import { Divider } from "@heroui/divider";
import HistoryBills from "./history/page";
import IncomingBills from "./incoming/page";
import LateBills from "./late/page";
import { serverSession } from "@/lib/serverSession";

export default async function Billing() {
    const session = await serverSession()
    await routeProtection(RoleAvailable.User, (session?.user.role || ""))
    return (
        <>
            <div className="px-10 py-7 w-full">
                <div className="flex flex-col w-fit">
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">E3 Billing</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                </div>
                <IncomingBills />
                <LateBills />
                <HistoryBills />
            </div>
        </>
    );
}