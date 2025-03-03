"use client"
import { Button } from "@heroui/button";

export default function BillCard() {
    return (
        <div className="flex w-full justify-between h-fit p-0" >
            <div className="flex flex-col items-center justify-center py-2 w-1/12 bg-background text-foreground rounded-l-lg">
                <p>status</p>
            </div>
            <div className="flex flex-col justify-evenly py-2 px-10 w-3/12 text-background border-2 border-background">
                <p>Date</p>
                <p>currency timeframe</p>
                <p>collection Date</p>
                <p>start balance</p>
                <p>order amount</p>
            </div>
            <div className="flex flex-col justify-evenly py-2 px-10 w-5/12 text-background border-2 border-background">
                <p>profit</p>
                <p>profit percent</p>
            </div>
            <div className="flex flex-col justify-evenly items-end py-2 w-3/12 bg-background p-5 rounded-r-lg">

                <p>total</p>
                <div className="flex justify-end items-center gap-5 w-full">
                    <p>fee</p>
                    <p>due date</p>
                    <Button color='secondary' variant='shadow' className="w-1/3 font-semibold text-black ">Pay</Button>
                </div>
                {/* <div className="flex-col items-start p-4 text-background w-full">
                    <h4 className="font-bold text-large ">USDJPY - M1</h4>
                    <p className="text-tiny uppercase font-bold ">Daily Mix</p>
                    <small className="text-md">12 Tracks</small>
                </div> */}
            </div>

        </div>
    );
}
