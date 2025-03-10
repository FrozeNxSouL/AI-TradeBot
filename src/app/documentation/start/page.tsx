"use client"
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

export default function Starting(){
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Getting Start</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex w-full items-center gap-5">
                
            </div>
        </div>
    );
}