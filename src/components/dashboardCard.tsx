"use client"
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

// export default function DashboardCard() {
//     return (
//         <Card className="py-4 w-fit h-fit p-0" radius="sm">
//             <CardBody className=" py-2 w-96 h-64 bg-slate-500">

//             </CardBody>
//             <CardHeader className="flex w-full p-0">
//                 <div className="flex-col items-start p-4 text-background w-3/5">
//                     <h4 className="font-bold text-large ">USDJPY - M1</h4>
//                     <p className="text-tiny uppercase font-bold ">Daily Mix</p>
//                     <small className="text-md">12 Tracks</small>
//                 </div>
//                 <div className="flex-col items-start p-4 text-accent bg-background w-2/5">
//                     <p className="text-tiny uppercase font-bold ">Profit</p>
//                     <small className="text-md">12 $</small>
//                     <h4 className="font-bold text-large">Option</h4>
//                 </div>
//             </CardHeader>

//         </Card>
//     );
// }


export default function DashboardCard() {
    return (
        <Card isFooterBlurred className="border-none" radius="lg">
            <div className="w-96 h-64 bg-red-400">
                <p>Graph Here!</p>
            </div>
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 p-0 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                <div className="flex-col items-start p-4 text-background w-3/5">
                    <h4 className="font-bold text-large ">USDJPY - M1</h4>
                    <p className="text-tiny uppercase font-bold ">balance</p>
                    <small className="text-md">collection date</small>
                </div>
                <div className="flex-col items-start p-4 text-accent bg-background w-2/5">
                    <p className="text-tiny uppercase font-bold ">Profit</p>
                    <small className="text-md">12 $</small>
                    <h4 className="font-bold text-large">Option</h4>
                </div>
            </CardFooter>
        </Card>
    );
}

