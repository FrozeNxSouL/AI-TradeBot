import AdvisorCard from "@/components/advisorCard";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

export default function Advisor() {
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Expert Advisors</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex w-full justify-end items-center gap-5">

                <Button as={Link} color="primary" href="/advisor/advisor_create" className="text-4xl w-1/4 p-7 px-10">+
                    <p className="font-semibold text-lg text-background capitalize">Create New Expert Advisor</p>
                </Button>
            </div>
            <div className="flex w-full px-5 py-10 gap-5">
                <AdvisorCard />
            </div>

        </div>
    );
}