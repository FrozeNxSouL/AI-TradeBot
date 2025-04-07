"use client"
import { TradeProvider } from "@/types/types";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AccountForm() {
    const session = useSession()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string>("");
    const [inputProvider, setInputProvider] = useState<string>("");
    const [error, setError] = useState<string>("");

    const accountCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const response = await fetch('/api/advisor/account', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                acc: data,
                id: session.data?.user.id,
                client: String(inputProvider)
            })
        });

        const result = await response.json();
        if (result.error) {
            setError(result.error);
        } else {
            setError("");
        }
        setLoading(false);
    }


    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Trading Account</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex w-full items-center gap-5">
                <form onSubmit={accountCreate} className="flex flex-col w-full gap-5 p-5">
                    <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
                        <Select
                            color="primary"
                            labelPlacement="outside"
                            size="lg"
                            className="max-w-md font-semibold mx-10 p-5"
                            label="TRADE BROKER"
                            variant="underlined"
                            placeholder="Select Trading Provider"
                            value={inputProvider}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputProvider(e.target.value)}
                        >

                            {Object.entries(TradeProvider)
                                .filter(([key]) => isNaN(Number(key)))
                                .map(([key, value]) => (
                                    <SelectItem key={value} className="text-foreground px-5">{key}</SelectItem>
                                ))}
                        </Select>
                    </div>
                    <Input
                        label="Account"
                        placeholder="Enter your Account"
                        className="pl-16 w-5/12 text-foreground"
                        isRequired
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(e.target.value)}
                        value={data}
                        type="text"
                        variant="bordered"
                    />
                    <p className="items-center text-danger h-5 font-medium">{error}</p>
                    <Button isLoading={loading} type="submit" color='primary' size="lg" variant='ghost' className="w-full font-semibold text-foreground text-md">Create</Button>
                </form>
            </div>
        </div>
    );
}