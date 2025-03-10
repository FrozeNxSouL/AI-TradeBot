"use client"
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// export default function DashboardCard() {
//     return (
//         <Card className="py-4 w-fit h-fit p-0" radius="sm">
//             <CardBody className=" py-2 w-96 h-64 bg-slate-500">

//             </CardBody>
//             <CardHeader className="flex w-full p-0">
//                 <div className="flex-col items-start p-4 text-foreground w-3/5">
//                     <h4 className="font-bold text-large ">USDJPY - M1</h4>
//                     <p className="text-tiny uppercase font-bold ">Daily Mix</p>
//                     <small className="text-md">12 Tracks</small>
//                 </div>
//                 <div className="flex-col items-start p-4 text-accent bg-foreground w-2/5">
//                     <p className="text-tiny uppercase font-bold ">Profit</p>
//                     <small className="text-md">12 $</small>
//                     <h4 className="font-bold text-large">Option</h4>
//                 </div>
//             </CardHeader>

//         </Card>
//     );
// }
const data = [
    { time: '09:00', price: 151.25 },
    { time: '09:05', price: 151.30 },
    { time: '09:10', price: 151.45 },
    { time: '09:15', price: 151.40 },
    { time: '09:20', price: 151.60 },
    { time: '09:25', price: 151.55 },
    { time: '09:30', price: 151.75 },
    { time: '09:35', price: 151.85 },
    { time: '09:40', price: 151.80 },
    { time: '09:45', price: 152.00 },
    { time: '09:50', price: 152.10 },
    { time: '09:55', price: 152.05 },
    { time: '10:00', price: 152.15 },
  ];

export default function DashboardCard() {
    return (
        <Card isFooterBlurred className="border-none" radius="lg">
            <div className="w-[475px] h-80 bg-foreground pb-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        {/* <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10 }}
                            padding={{ left: 10, right: 10 }}
                        /> */}
                        <YAxis
                            domain={['dataMin - 0.2', 'dataMax + 0.2']}
                            tick={{ fontSize: 8 }}
                            width={35}
                        />
                        {/* <Tooltip/> */}
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#26DE29"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 p-0 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 left-1 w-[calc(100%_-_8px)] shadow-small z-10">
                <div className="flex-col items-start p-4 text-foreground bg-primary w-3/5">
                    <h4 className="font-bold text-large ">USDJPY - M1</h4>
                    <p className="text-tiny uppercase font-bold ">balance</p>
                    <small className="text-md">collection date</small>
                </div>
                <div className="flex-col items-start p-4 text-accent bg-foreground w-2/5">
                    <p className="text-tiny uppercase font-bold ">Profit</p>
                    <small className="text-md">12 $</small>
                    <h4 className="font-bold text-large">Option</h4>
                </div>
            </CardFooter>
        </Card>
    );
}

