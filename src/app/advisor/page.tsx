import AdvisorCard from "@/components/advisorCard";
import { Button } from "@heroui/button";


export default function Advisor() {
    return (
        <div className="flex flex-col gap-10 items-center">
            <p className="font-bold text-3xl text-background uppercase w-full text-center">Expert Advisors</p>
            <div className="flex w-full justify-end items-center gap-5">

                <Button color="primary" href="/advisor/advisor_create" className="text-4xl w-1/4 p-7 px-10">+
                    <p className="font-semibold text-lg text-foreground capitalize">Create New Expert Advisor</p>
                </Button>
            </div>
            <div className="flex w-full px-5 py-10 gap-5">
                <AdvisorCard />
            </div>

        </div>
    );
}