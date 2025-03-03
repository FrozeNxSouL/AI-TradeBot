"use client"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { useState } from "react";

export default function AdvisorCard() {
    const [isSelected, setIsSelected] = useState(true);
    return (
        <Card className="py-4 w-fit h-fit p-0" radius="sm">
            <CardHeader className="flex w-72 p-0">
                <div className="flex flex-col items-start gap-2 p-6 text-accent bg-background w-full">
                    <h4 className="font-bold text-large uppercase text-primary text-end w-full">USDJPY - M1</h4>
                    <p className="text-tiny uppercase font-semibold ">ID : XI22647 </p>
                    <p className="text-tiny uppercase font-normal ">Start Date : 25/6/64 </p>
                    <p className="text-tiny uppercase font-normal ">Billing Date : 30/6/64 </p>
                    <p className="text-tiny uppercase font-normal ">Orders Sended : 1124 </p>
                </div>
            </CardHeader>
            {/* <CardBody className=" py-2 w-96 h-64 bg-slate-500">

            </CardBody> */}
            <CardFooter>
                <div className="flex items-center gap-2">
                    <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                    </Switch>
                    <p className="text-small text-default-500">Status : {isSelected ? "On" : "Off"}</p>
                </div>
            </CardFooter>
        </Card>
    );
}
