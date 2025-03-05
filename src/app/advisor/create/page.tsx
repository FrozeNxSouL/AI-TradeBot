"use client"
import AdvisorCard from "@/components/advisorCard";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { TradeProvider } from "@/types/types";
import { Chip } from "@heroui/chip";

export default function CreateAdvisor() {
    const [validation, setValidation] = useState(
        {
            name: {
                regex: /^[\wก-๙a-zA-Z]{4,30}$/,
                errorMsg: "ต้องการอักขระ ภาษาไทย, อังกฤษจำนวน 4-30 ตัว",
                isError: false,
            },
            email: {
                regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                errorMsg: "กรุณากรอก email ให้ถูกต้อง",
                isError: false
            },
            password: {
                errorMsg: "",
                isError: false,
            },
            result: {
                errorMsg: "",
                isError: false,
            }
        }
    )
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        repass: "",
    });

    const advisorCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!data.email || !data.password || !data.repass) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: true,
                    errorMsg: "กรุณากรอกข้อมูลให้ครบถ้วน"
                },
            }));
            setLoading(false);
            return;
        }

        if (data.password !== data.repass) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                password: {
                    isError: true,
                    errorMsg: "รหัสผ่านทั้ง 2 ช่องไม่ตรงกัน"
                },
            }));
            return;
        }

        const response = await fetch('/api/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data })
        });

        const result = await response.json();
        if (result.error) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: true,
                    errorMsg: result.error
                },
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: false,
                    errorMsg: ""
                },
            }));
            // signIn("credentials", {
            //     email: data.email,
            //     password: data.password,
            // });
        }
        setLoading(false);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, email: e.target.value })
        let newValidation = validation
        if (!validation.email.regex.test(e.target.value)) {
            newValidation.email.isError = true
        } else {
            newValidation.email.isError = false
        }
        setValidation(newValidation)
    }
    return (
        <div className="flex flex-col px-10 py-7 w-full">
            <div className="flex flex-col w-fit">
                <p className="font-bold text-3xl text-background uppercase pr-20">Advisors Creation</p>
                <Divider className="my-4 bg-background h-0.5" />
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
                            >
                                {/* {animals.map((animal) => (
                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                            ))} */}
                                <SelectItem className="text-background px-5">{"USDJPY"}</SelectItem>
                                <SelectItem className="text-background px-5">{"USDCAD"}</SelectItem>
                                <SelectItem className="text-background px-5">{"EURUSD"}</SelectItem>
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
                            >
                                {/* {animals.map((animal) => (
                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                            ))} */}
                                <SelectItem className="text-background px-5">{"M1"}</SelectItem>
                                <SelectItem className="text-background px-5">{"H1"}</SelectItem>
                                <SelectItem className="text-background px-5">{"D1"}</SelectItem>
                            </Select>
                        </div>

                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
                        <Select
                            color="primary"
                            labelPlacement="outside"
                            size="lg"
                            className="max-w-md font-semibold mx-10 p-5"
                            label="ACCOUNT"
                            variant="underlined"
                            placeholder="Select Trading Account for Advisor"
                        >
                            {/* {animals.map((animal) => (
                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                            ))} */}
                            <SelectItem>
                                <div className="flex gap-2 items-center w-full">
                                    <div className="flex flex-col w-full gap-2 py-2 px-4">
                                        <Chip color="primary" className="text-small text-background border-background" variant="dot">
                                            {"MetaTrader"}
                                        </Chip>
                                        <span className="text-tiny text-default-500 pl-5">{"User 54831457"}</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem>
                                <div className="flex gap-2 items-center w-full">
                                    <div className="flex flex-col w-full gap-2 py-2 px-4">
                                        <Chip color="primary" className="text-small text-background border-background" variant="dot">
                                            {"MetaTrader"}
                                        </Chip>
                                        <span className="text-tiny text-default-500 pl-5">{"User 89647543"}</span>
                                    </div>
                                </div>
                            </SelectItem>
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
                            placeholder="Select a Available Model"
                        >
                            {/* {animals.map((animal) => (
                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                            ))} */}

                            <SelectItem className="text-background">
                                <div className="flex gap-2 items-center w-full">
                                    <div className="flex flex-col bg-background rounded-md w-full py-2 px-4">
                                        <span className="text-small text-primary">{"USDJPY - M1"}</span>
                                        <span className="text-tiny text-default-400">{"Version 54"}</span>
                                    </div>
                                    <div className="flex flex-col w-full py-2 px-4">
                                        <span className="text-small">{"Deploy Date 02/02/23"}</span>
                                        <span className="text-tiny text-default-400">{"ID 0x8567"}</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem className="text-background">
                                <div className="flex gap-2 items-center w-full">
                                    <div className="flex flex-col bg-background rounded-md w-full py-2 px-4">
                                        <span className="text-small text-primary">{"USDJPY - M1"}</span>
                                        <span className="text-tiny text-default-400">{"Version 52"}</span>
                                    </div>
                                    <div className="flex flex-col w-full py-2 px-4">
                                        <span className="text-small">{"Deploy Date 01/02/23"}</span>
                                        <span className="text-tiny text-default-400">{"ID 0x8565"}</span>
                                    </div>
                                </div>
                            </SelectItem>
                        </Select>
                    </div>
                    <Button isLoading={loading} type="submit" color='primary' size="lg" variant='ghost' className="w-full font-semibold text-background text-md">Create</Button>
                </form>
            </div>

        </div>
    );
}