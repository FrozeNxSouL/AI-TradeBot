import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";

import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { LockIcon, MailIcon } from "../utils/icon";
import { useState } from "react";
import { signInType } from "@/types/types";
import { signIn } from "next-auth/react";


export default function LoginForm({ onClose }: { onClose: () => void }) {
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
    const [data, setData] = useState<signInType>({
        email: "",
        password: "",
    });

    const signInUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!data.email || !data.password ) {
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

        const response = await fetch('api/signin', {
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
        let newValidation = validation
        if (!validation.email.regex.test(e.target.value)) {
            newValidation.email.isError = true
        } else {
            newValidation.email.isError = false
        }
        setValidation(newValidation)
    }
    return (
        <>
            <form onSubmit={signInUser}>
                <ModalBody>
                    <Input
                        endContent={
                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        isRequired
                        onChange={handleEmailChange}
                        isInvalid={validation.email.isError}
                        errorMessage={validation.email.errorMsg}
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
                    {/* <div className="flex py-2 px-1 justify-between">
                        <Link color="primary" href="#" size="sm">
                            Forgot password?
                        </Link>
                    </div> */}
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                </Button> */}
                    <Button isLoading={loading} type="submit" color='primary' variant='shadow' className="w-full font-semibold text-black">Enter</Button>
                </ModalFooter>
            </form>
        </>
    );
}
