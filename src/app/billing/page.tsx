import BillCard from "@/components/billCard";


export default function Billing() {
    return (
        <>
            <p className="font-bold text-3xl text-background uppercase">Billing</p>
            <div className="flex flex-col items-center w-full px-5 py-10 gap-5">
                <BillCard />
            </div>
        </>
    );
}

