import { Divider } from "@heroui/divider";


export default function Documentation() {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col px-10 py-7 w-full">
                <div className="flex flex-col items-center w-full">
                    <p className="font-bold text-2xl text-foreground uppercase pr-20">Trading System</p>
                    <p className="font-bold text-3xl text-foreground uppercase pr-20">Documentation</p>
                    <Divider className="my-4 bg-foreground h-0.5" />
                </div>
                <div className="flex flex-col w-full justify-end items-center gap-5 text-wrap text-foreground px-24 py-10">
                    <p className="text-xl indent-20">
                        Money Glitch is AI-supported trading System for forex. This system communicate between server
                        for AI-supported prediction and trading client ( MetaTrader, Binance etc. ). This website can provide
                        these system for you and include observing trade orders. Pricing is also included. See more detail on topics
                        of this trading system.

                    </p>
                </div>

            </div>
        </div>
    );
} 
