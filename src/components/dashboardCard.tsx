"use client"
import { Card, CardHeader, CardBody } from "@heroui/card";

export default function DashboardCard() {
    return (
        <Card className="py-4 w-fit h-fit p-0" radius="sm">
            <CardBody className=" py-2 w-96 h-64 bg-slate-500">
                <p>Graph Here!</p>
            </CardBody>
            <CardHeader className="flex w-full p-0">
                <div className="flex-col items-start p-4 text-background w-3/5">
                    <h4 className="font-bold text-large ">USDJPY - M1</h4>
                    <p className="text-tiny uppercase font-bold ">Daily Mix</p>
                    <small className="text-md">12 Tracks</small>
                </div>
                <div className="flex-col items-start p-4 text-accent bg-background w-2/5">
                    <p className="text-tiny uppercase font-bold ">Profit</p>
                    <small className="text-md">12 $</small>
                    <h4 className="font-bold text-large">Option</h4>
                </div>
            </CardHeader>

        </Card>
    );
}
