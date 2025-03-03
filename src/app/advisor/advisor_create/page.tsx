import AdvisorCard from "@/components/advisorCard";
import { Button } from "@heroui/button";


export default function Advisor() {
    return (
        <div className="flex flex-col items-center">
            <p className="font-bold text-3xl text-background uppercase w-full text-center">Creation</p>
            
            <div className="flex w-full px-5 py-10 gap-5">
                {/* <AdvisorCard /> */}
            </div>
            <Button color="primary" href="#" className="text-3xl w-5/6 p-7 px-10">+</Button>
        </div>
    );
}