"use client"
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

export default function AccountForm() {
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

    const accountCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
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
        // onClose();
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
                <p className="font-bold text-3xl text-background uppercase pr-20">Trading Account</p>
                <Divider className="my-4 bg-background h-0.5" />
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
                            placeholder="Select Currency"
                        >
                            {/* {animals.map((animal) => (
                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                            ))} */}
                            <SelectItem className="text-background px-5">{"MetaTrader"}</SelectItem>
                            <SelectItem className="text-background px-5">{"Binance"}</SelectItem>
                        </Select>
                    </div>
                    <Input
                        // endContent={
                        //     <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        // }
                        label="User"
                        placeholder="Enter your username"
                        className="pl-16 w-5/12 text-background"
                        isRequired
                        isInvalid={validation.password.isError}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, password: e.target.value })}
                        value={data.password}
                        type="text"
                        variant="bordered"
                    />
                    {validation.result.isError && <span className="auth-error">{validation.result.errorMsg}</span>}
                    <Button isLoading={loading} type="submit" color='primary' size="lg" variant='ghost' className="w-full font-semibold text-background text-md mt-10">Create</Button>
                </form>
            </div>
        </div>
    );
}