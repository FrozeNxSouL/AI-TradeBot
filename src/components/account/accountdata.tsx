"use client"

import { parseDate } from "@internationalized/date"
import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Input } from "@heroui/input"
import { User } from "@prisma/client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Switch } from "@heroui/switch"

export default function AccountProfileCard({ userData }: { userData: User }) {
    const router = useRouter();
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [validation, setValidation] = useState(
        {
            email: {
                regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                errorMsg: "Enter your email Correctly",
                isError: false
            },
            credit: {
                regex: /^[0-9]{13}$/,
                errorMsg: "Enter your Credit Card Number Correctly",
                isError: false
            },
            result: {
                errorMsg: "Some Value is Incorrect",
                isError: false
            }
        }
    )
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState({
        current: "",
        new1: "",
        new2: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({
        current: false,
        new1: false,
        new2: false,
    });
    const { data: session, update } = useSession();
    const [data, setData] = useState<User>(userData);

    useEffect(() => {
        setSuccess(false);
    }, [data])

    // const openPasswordBox = () => {
    //     const { current, new1, new2 } = password;
    //     const newErrors = { current: false, new1: false, new2: false };

    //     if (!current) {
    //         newErrors.current = true;
    //         setError("กรุณากรอกรหัสผ่านปัจจุบัน");
    //     }

    //     if (new1 !== new2) {
    //         newErrors.new1 = true;
    //         newErrors.new2 = true;
    //         setError("รหัสผ่านไม่ตรง");
    //     }

    //     if (!new1 || !new2) {
    //         newErrors.new1 = true;
    //         newErrors.new2 = true;
    //         setError("กรุณากรอก ช่องรหัสผ่านที่จะเปลี่ยน");
    //     }

    //     setPasswordErrors(newErrors);
    //     return !newErrors.current && !newErrors.new1 && !newErrors.new2;
    // }


    const changePasswordValidation = () => {
        const { current, new1, new2 } = password;
        const newErrors = { current: false, new1: false, new2: false };

        if (!current) {
            newErrors.current = true;
            setError("กรุณากรอกรหัสผ่านปัจจุบัน");
        }

        if (new1 !== new2) {
            newErrors.new1 = true;
            newErrors.new2 = true;
            setError("รหัสผ่านไม่ตรง");
        }

        if (!new1 || !new2) {
            newErrors.new1 = true;
            newErrors.new2 = true;
            setError("กรุณากรอก ช่องรหัสผ่านที่จะเปลี่ยน");
        }

        setPasswordErrors(newErrors);
        return !newErrors.current && !newErrors.new1 && !newErrors.new2;
    }

    const handleEditProfile = async () => {
        setLoading(true);
        let group_password = null;
        if (userData.provider == "credentials") {
            if (!changePasswordValidation()) {
                setLoading(false);
                return;
            } else if (isSelected) {
                group_password = password
            }
        }

        // Check for empty required fields (both null and empty string)
        if (!data.user_email || !data.user_card) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: true,
                    errorMsg: "กรุณากรอกข้อมูลให้ครบถ้วน",
                },
            }));
            setLoading(false);
            return;
        }

        // Additional validation checks if any
        if (validation.email.isError || validation.credit.isError) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: true,
                    errorMsg: "กรุณากรอกข้อมูลให้ถูกต้อง",
                },
            }));
            setLoading(false);
            return;
        }

        // Send data to the server
        const response = await fetch('/api/modify_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: data.user_id,
                email: data.user_email,
                card: data.user_card,
                group_password
            }),
        });

        const result = await response.json();
        if (result.error) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: true,
                    errorMsg: result.error,
                },
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: false,
                    errorMsg: "",
                },
            }));
            setSuccess(true);
        }
        setLoading(false);
        update();
        router.refresh();
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, user_email: e.target.value })
        let newValidation = validation
        if (!validation.email.regex.test(e.target.value)) {
            newValidation.email.isError = true
        } else {
            newValidation.email.isError = false
        }
        setValidation(newValidation)
    }

    const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, user_card: e.target.value })
        let newValidation = validation
        if (!validation.credit.regex.test(e.target.value)) {
            newValidation.credit.isError = true
        } else {
            newValidation.credit.isError = false
        }
        setValidation(newValidation)
    }

    return (
        <Card className="w-2/5 p-5">
            <CardHeader>
                <h2 className="font-bold uppercase text-2xl">Account</h2>
            </CardHeader>
            <CardBody className="gap-3 space-y-3">
                <Input variant="underlined" isRequired label="Email" isInvalid={validation.email.isError} errorMessage={validation.email.errorMsg} onChange={handleEmailChange} value={data.user_email ?? ""} />
                <Input variant="underlined" maxLength={16} label="Credit Card" isInvalid={validation.credit.isError} errorMessage={validation.credit.errorMsg} onChange={handleIdCardChange} value={data.user_card ?? ""} required />
                {userData.provider == "credentials" && (
                    <>
                        <div className="flex gap-3 items-center">
                            <Switch isSelected={isSelected} onValueChange={setIsSelected}></Switch>
                            <p className="text-small text-default-500">Change Password : {isSelected ? "On" : "Off"}</p>
                        </div>
                        {isSelected && (
                            <>
                                <Input
                                    isRequired
                                    variant="underlined"
                                    label="Current password"
                                    type="password"
                                    // value={data.user_password ?? ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setPassword({ ...password, current: e.target.value });
                                        setPasswordErrors({ ...passwordErrors, current: false }); // Reset error on change
                                    }}
                                    isInvalid={passwordErrors.current}
                                />
                                <Input
                                    isRequired
                                    variant="underlined"
                                    label="New password"
                                    type="password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setPassword({ ...password, new1: e.target.value });
                                        setPasswordErrors({ ...passwordErrors, new1: false }); // Reset error on change
                                    }}
                                    isInvalid={passwordErrors.new1}
                                />
                                <Input
                                    isRequired
                                    variant="underlined"
                                    label="Re-new password"
                                    type="password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setPassword({ ...password, new2: e.target.value });
                                        setPasswordErrors({ ...passwordErrors, new2: false }); // Reset error on change
                                    }}
                                    isInvalid={passwordErrors.new2}
                                />
                            </>
                        )}

                    </>
                )}
                {validation.result.isError && <span className="auth-error">{validation.result.errorMsg}</span>}
                {success && <span className="text-success-500">แก้ไขข้อมูลสำเร็จ</span>}
                {/* <Button isLoading={loading} spinner={<Spinner color="white" size="sm" />} onClick={handleEditProfile} radius="full" color="primary">Save</Button> */}
                <Button isLoading={loading} onPress={handleEditProfile} color='primary' variant='shadow' className="w-full font-semibold">Save</Button>
            </CardBody>
        </Card>
    )
}