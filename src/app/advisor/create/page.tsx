"use client"
import AdvisorCard from "@/components/advisor/advisorCard";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useEffect, useState } from "react";
import { Select, SelectedItems, SelectItem } from "@heroui/select";
import { Modeltype, Timeframetype, TradeProvider } from "@/types/types";
import { Chip } from "@heroui/chip";
import { useSession } from "next-auth/react";
import { Account, Model } from "@prisma/client";

export default function CreateAdvisor() {
    const session = useSession()
    const [accData, setAccData] = useState<Account[]>([])
    const [modelData, setModelData] = useState<Model[]>([])
    const [inputTimeframe, setInputTimeframe] = useState<string>("");
    const [inputCurrency, setInputCurrency] = useState<string>("");
    const [inputModel, setInputModel] = useState<string>("");
    const [inputAccount, setInputAccount] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("")
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fecthData = async () => {
            try {
                if (session.status != "authenticated") {
                    return
                }
                console.log(session.data?.user.id)
                const response = await fetch('/api/advisor/find_acc', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data: { id: session.data?.user.id } })
                });
                if (!response.ok) {
                    throw new Error('Failed to Account');
                }
                const data = await response.json();
                console.log(data.accounts)
                setAccData(data.accounts);

                // setLoading(false)
            }
            catch (error) {
                console.error('Error fetching Account:', error);
            }
        }
        fecthData();
    }, [session.status]);

    useEffect(() => {
        const fecthModel = async () => {
            try {
                const response = await fetch('/api/advisor/find_model', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data: { currency: inputCurrency, timeframe: inputTimeframe } })
                });
                if (!response.ok) {
                    throw new Error('Failed to model');
                }
                const data = await response.json();
                console.log(data.models)
                setModelData(data.models);

                // setLoading(false)
            }
            catch (error) {
                console.error('Error fetching Account:', error);
            }
        }
        fecthModel();
    }, [inputCurrency, inputTimeframe]);

    const advisorCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('/api/advisor/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data : { uid:session.data?.user.id, mid:Number(inputModel), aid:Number(inputAccount)} })
        });

        const result = await response.json();
        if (result.error) {
            setErrorMsg(result.error)
        } else {
            setErrorMsg("");
        }
        setLoading(false);
    }

    // const broker = [
    //     {
    //         id: 1,
    //         name: "85245896",
    //         provider: "MetaTrader"
    //     },
    //     {
    //         id: 2,
    //         name: "25458964",
    //         provider: "MetaTrader"
    //     },
    // ];

    // const models = [
    //     {
    //         id: 1,
    //         model_type: "USDCAD - M1",
    //         model_id: "X85436",
    //         model_date: "02/02/22",
    //         version: "10"
    //     },
    //     {
    //         id: 2,
    //         model_type: "USDJPY - M1",
    //         model_id: "X85432",
    //         model_date: "02/03/22",
    //         version: "12"
    //     },
    // ];
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-foreground uppercase pr-20">Advisors Creation</p>
                <Divider className="my-4 bg-foreground h-0.5" />
            </div>
            <div className="flex w-full justify-end items-center gap-5">
                <form onSubmit={advisorCreate} className="flex flex-col w-full gap-5 p-5">
                    {/* <Button isLoading={loading} spinner={
                    <Spinner color="white" size="sm" />
                    } type="submit" color='primary' variant='shadow' className="uppercase w-full" radius="full" >sign in</Button>
                    <Divider className="my-3" /> */}
                    <div className="flex justify-start gap-10">
                        <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
                            <Select
                                color="primary"
                                labelPlacement="outside"
                                size="lg"
                                className="max-w-md font-semibold mx-10 p-5"
                                label="CURRENCY"
                                variant="underlined"
                                placeholder="Select Currency"
                                value={inputCurrency}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputCurrency(e.target.value)}
                            >
                                {Object.entries(Modeltype)
                                    .filter(([key]) => isNaN(Number(key)))
                                    .map(([key, value]) => (
                                        <SelectItem key={value} className="text-foreground px-5">{key}</SelectItem>
                                    ))}
                            </Select>
                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
                            <Select
                                color="primary"
                                labelPlacement="outside"
                                size="lg"
                                className="max-w-md font-semibold mx-10 p-5"
                                label="TIMEFRAME"
                                variant="underlined"
                                placeholder="Select Timeframe"
                                value={inputTimeframe}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputTimeframe(e.target.value)}
                            >
                                {Object.entries(Timeframetype)
                                    .filter(([key]) => isNaN(Number(key)))
                                    .map(([key, value]) => (
                                        <SelectItem key={value} className="text-foreground px-5">{key}</SelectItem>
                                    ))}
                                {/* {Object.values(Timeframetype).map((value) => (
                                    <SelectItem key={value} className="text-foreground px-5">
                                        {value}
                                    </SelectItem>
                                ))} */}
                            </Select>
                        </div>

                    </div>
                    {accData && modelData && (
                        <>
                            <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
                                <Select
                                    color="primary"
                                    labelPlacement="outside"
                                    size="lg"
                                    className="max-w-md font-semibold mx-10 p-5"
                                    label="ACCOUNT"
                                    variant="underlined"
                                    placeholder="Select Trading Account for Advisor"
                                    value={inputAccount}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                                        setInputAccount(e.target.value)
                                    }
                                    items={accData}
                                    renderValue={(items: SelectedItems<Account>) => {
                                        return items.map((item) => (
                                            <div key={item.key} className="flex gap-2 items-center w-full">
                                                <div className="flex items-center w-full gap-2 py-2 px-4">
                                                    <Chip color="primary" className="text-small text-background bg-foreground border-background" variant="dot">
                                                        {item.data?.acc_client}
                                                    </Chip>
                                                    <span className="text-tiny text-default-600 pl-5">{item.data?.acc_name}</span>
                                                </div>
                                            </div>
                                        ));
                                    }}
                                >
                                    {(account: Account) => (
                                        <SelectItem key={account.acc_id} textValue={account.acc_id.toString()}>
                                            <div className="flex gap-2 items-center w-full">
                                                <div className="flex w-full items-center gap-2 py-2 px-4">
                                                    <Chip color="primary" className="text-small text-background bg-foreground border-background" variant="dot">
                                                        {account.acc_client}
                                                    </Chip>
                                                    <p className="text-tiny text-default-600 pl-5">{account.acc_name}</p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
                                <Select
                                    color="primary"
                                    labelPlacement="outside"
                                    size="lg"
                                    className="max-w-md font-semibold mx-10 p-5"
                                    label="Model"
                                    variant="underlined"
                                    placeholder="Select an Available Model"
                                    value={inputModel}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                                        setInputModel(e.target.value)
                                    }
                                    items={modelData}
                                    renderValue={(items: SelectedItems<Model>) => {
                                        return (
                                            <div className="flex flex-wrap gap-2">
                                                {items.map((item) => (
                                                    <div key={item.key} className="flex gap-2 items-center w-full">
                                                        <div className="flex flex-col bg-foreground rounded-md w-5/12 py-1.5 px-4">
                                                            <span className="text-small text-primary">
                                                                {item.data?.model_currency} {item.data?.model_timeframe}
                                                            </span>
                                                            <span className="text-tiny text-default-400">
                                                                Version {item.data?.model_version}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col w-7/12 py-2 px-4">
                                                            <span className="text-small">
                                                                Create Date {new Date(item.data?.model_date || "").toDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }}
                                >
                                    {(model: Model) => (
                                        <SelectItem key={model.model_id} textValue={model.model_id.toString()} className="text-foreground">
                                            <div className="flex gap-2 items-center w-full">
                                                <div className="flex flex-col bg-foreground rounded-md w-5/12 py-2 px-4">
                                                    <span className="text-small text-primary">
                                                        {model.model_currency} {model.model_timeframe}
                                                    </span>
                                                    <span className="text-tiny text-default-400">
                                                        Version {model.model_version}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col w-7/12 py-2 px-4">
                                                    <span className="text-small">
                                                        Create Date {new Date(model.model_date).toDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                            </div>
                        </>
                    )}
                    <Button isLoading={loading} type="submit" color='primary' size="lg" variant='ghost' className="w-full font-semibold text-foreground text-md">Create</Button>
                    <p className="text-black">{errorMsg}</p>
                </form>
            </div>

        </div>
    );
}