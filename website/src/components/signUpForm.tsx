"use client"
import {
    ModalBody,
    ModalFooter
} from "@heroui/modal";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { signUpType } from "@/types/types";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { LockIcon, MailIcon } from "../utils/icon";


export default function SignUpForm({ onClose }: { onClose: () => void }) {
    const [validation, setValidation] = useState(
        {
            email: {
                regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                errorMsg: "Incorrect Email",
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
    const [data, setData] = useState<signUpType>({
        email: "",
        password: "",
        repass: "",
    });

    const signUpUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!data.email || !data.password || !data.repass) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                result: {
                    isError: true,
                    errorMsg: "Please input all data"
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
                    errorMsg: "Password not matched"
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
            signIn("credentials", {
                email: data.email,
                password: data.password,
            });
        }
        setLoading(false);
        onClose();
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, email: e.target.value })
        const newValidation = validation
        if (!validation.email.regex.test(e.target.value)) {
            newValidation.email.isError = true
        } else {
            newValidation.email.isError = false
        }
        setValidation(newValidation)
    }

    return (
        <>
            <form onSubmit={signUpUser}>
                <ModalBody>
                    {/* <Button isLoading={loading} spinner={
                    <Spinner color="white" size="sm" />
                    } type="submit" color='primary' variant='shadow' className="uppercase w-full" radius="full" >sign in</Button>
                    <Divider className="my-3" /> */}


                    <Input
                        endContent={
                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        isRequired
                        onChange={handleEmailChange}
                        isInvalid={validation.email.isError}
                        errorMessage={validation.email.errorMsg}
                        className="text-foreground"
                        value={data.email}
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                    />
                    <Input
                        endContent={
                            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Password"
                        className="text-foreground"
                        placeholder="Enter your password"
                        isRequired
                        isInvalid={validation.password.isError}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, password: e.target.value })}
                        value={data.password}
                        type="password"
                        variant="bordered"
                    />

                    <Input
                        endContent={
                            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        isRequired
                        className="text-foreground"
                        isInvalid={validation.password.isError}
                        errorMessage={validation.password.errorMsg}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, repass: e.target.value })}
                        value={data.repass}
                        label="Re-password"
                        placeholder="Enter your password again"
                        type="password"
                        variant="bordered"
                    />
                    {validation.result.isError && <span className="auth-error">{validation.result.errorMsg}</span>}

                    {/* <Button onPress={() => signIn("google", { callbackUrl: "/" })} className="bg-white text-black w-full border-background border-2"><IconGoogle />Sign in with Google</Button> */}
                    {/* <div className="flex py-2 px-1 justify-between">
                        <Link color="secondary" href="#" size="sm">
                            Forgot password?
                        </Link>
                    </div> */}
                </ModalBody >
                <ModalFooter>
                    {/* <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                </Button> */}
                    <Button isLoading={loading} type="submit" color='secondary' variant='shadow' className="w-full font-semibold text-black">Sign in</Button>
                </ModalFooter>
            </form>
        </>
    );
}

