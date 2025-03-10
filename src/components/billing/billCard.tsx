"use client"
import { Button } from "@heroui/button";

export default function BillCard() {
    return (
        <div className="flex w-full justify-between h-fit p-0" >
            <div className="flex flex-col items-center justify-center py-2 w-1/12 bg-foreground text-background rounded-l-lg">
                <p>status</p>
            </div>
            <div className="flex flex-col justify-evenly py-2 px-10 w-3/12 text-foreground border-2 border-foreground text-xs">
                <p>Date</p>
                <p>currency timeframe</p>
                <p>collection Date</p>
                <p>start balance</p>
                <p>order amount</p>
            </div>
            <div className="flex flex-col justify-evenly py-2 px-10 w-5/12 text-foreground border-2 border-foreground">
                <p>profit</p>
                <p>profit percent</p>
            </div>
            <div className="flex flex-col justify-evenly items-end py-2 w-3/12 bg-foreground p-5 rounded-r-lg">

                <p>total</p>
                <div className="flex justify-end items-center gap-5 w-full">
                    <p>fee</p>
                    <p>due date</p>
                    <Button color='secondary' variant='shadow' className="w-1/3 font-semibold text-black ">Pay</Button>
                </div>
            </div>

        </div>
    );
}
