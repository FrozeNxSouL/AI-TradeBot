"use client"
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Link } from "@heroui/link";
import {
    Modal,
    ModalContent,
    useDisclosure
} from "@heroui/modal";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { AccountCircle, Book2Line, Exit, MoneySVG, WatchLater } from "../utils/icon";

import { BillsPayload, PaymentStatus, RoleAvailable } from "@/types/types";
import { Chip } from "@heroui/chip";
import { Tab, Tabs } from "@heroui/tabs";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./loginForm";
import SignUpForm from "./signUpForm";

export default function MainNavbar() {
    const router = useRouter()
    const { data: session, status } = useSession();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [arrivelength, setArrivelength] = useState<number>(0);
    const [latelength, setLatelength] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {

            try {
                // Reset states
                if (status == "authenticated") {
                    const response = await fetch('/api/billing', {
                        method: "POST",
                        body: JSON.stringify({ data: { id: session.user.id } })
                    });
                    if (response.ok) {
                        // Transform data to match the expected format
                        const output = await response.json();
                        const arrivebilllength = output.billData.filter((bill: BillsPayload) => bill.bill_status == PaymentStatus.Arrive).length
                        const latebilllength = (output.billData.filter((bill: BillsPayload) => bill.bill_status == PaymentStatus.Delay)).length
                        setArrivelength(arrivebilllength);
                        setLatelength(latebilllength)
                    }
                }
            } catch {
                console.log("Navbar Failed")
            }
        }

        fetchData();
    }, [status]);

    return (
        <Navbar className="flex bg-foreground opacity-95 border-b-primary backdrop-blur-sm border-b-2" maxWidth="full">
            <NavbarBrand>
                <Link href="/">
                    <p className="font-bold text-xl uppercase text-primary">money</p>
                    <p className="font-bold text-xl uppercase text-accent">glitch</p>
                </Link>

            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-7" justify="center">
                {session?.user.role == RoleAvailable.User && status == "authenticated" && (
                    <>
                        <NavbarItem className="hover:text-primary">
                            <Link className="text-background hover:text-primary" href="/dashboard">
                                Dashboard
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="hover:text-primary">
                            <Link className="text-background hover:text-primary" href="/advisor">
                                Advisor
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="hover:text-primary">
                            <Link className="text-background hover:text-primary" href="/billing">
                                Billing
                            </Link>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
            <NavbarContent justify="end">
                {session ? (
                    <NavbarItem className="hidden lg:flex">
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Button className="text-background" variant="bordered">{session.user.email}</Button>
                            </DropdownTrigger>
                            {/* <DropdownMenu aria-label="Dropdown menu with description" variant="shadow" onAction={(key) => router.push(`/${key}`)}> */}
                            <DropdownMenu aria-label="Dropdown menu with description" variant="shadow" className="w-full">
                                <DropdownItem
                                    key="account"
                                    showDivider
                                    description="Profile and Description"
                                    className="text-foreground"
                                    startContent={<AccountCircle className="w-5 h-5" />}
                                    onPress={() => router.push(`/account`)}
                                >
                                    {/* <Link color="foreground" href="/account"> */}
                                    Account
                                    {/* </Link> */}
                                </DropdownItem>

                                {arrivelength > 0 || latelength > 0 ? (
                                    <DropdownItem
                                        key="bill_box"
                                    >
                                        <div className="flex justify-around w-44 h-fit">

                                            {arrivelength > 0 ? (
                                                <div className="flex flex-col w-2/3 items-center gap-0.5">
                                                    <MoneySVG className="w-5 h-5 text-secondary" />
                                                    <p className="text-foreground font-semibold text-tiny">Arrived</p>
                                                    <Chip size="sm" color="warning" >{arrivelength ?? 0}</Chip>
                                                </div>
                                            ) : null}

                                            {latelength > 0 ? (
                                                <div className="flex flex-col w-2/3 items-center gap-0.5">
                                                    <WatchLater className="w-5 h-5 text-danger" />
                                                    <p className="text-foreground font-semibold text-tiny">Late</p>
                                                    <Chip size="sm" color="danger" >{latelength ?? 0}</Chip>
                                                </div>
                                            ) : null}

                                        </div>
                                    </DropdownItem>
                                ) : null}

                                {session.user.role == RoleAvailable.Admin ? (
                                    <DropdownItem
                                        key="admin"
                                        description="Admin"
                                        className="text-foreground"
                                        onPress={() => router.push(`/admin`)}
                                    >
                                        {/* <Link color="foreground" href="/documentation"> */}
                                        Admin Configuration
                                        {/* </Link> */}
                                    </DropdownItem>
                                ) : null}

                                <DropdownItem
                                    key="documentation"
                                    startContent={<Book2Line className="w-5 h-5" />}
                                    showDivider
                                    description="Document of the System"
                                    className="text-foreground"
                                    onPress={() => router.push(`/documentation`)}
                                >
                                    {/* <Link color="foreground" href="/documentation"> */}
                                    Documentation
                                    {/* </Link> */}
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    className="text-danger"
                                    startContent={<Exit className="w-5 h-5" />}
                                    color="danger"
                                    description="Logout from current user"
                                    onPress={() => signOut()}
                                // startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                ) : (
                    <NavbarItem>
                        <Button as={Link} color="primary" href="#" variant="ghost" onPress={onOpen}>
                            Sign In
                        </Button>

                        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} hideCloseButton>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <Tabs
                                            aria-label="Dynamic tabs"
                                            fullWidth
                                            size="lg"
                                            variant="light"
                                        >
                                            <Tab key={0} title={"Login"} className="text-lg font-bold">
                                                <LoginForm onClose={onClose} />
                                            </Tab>

                                            <Tab key={1} title={"Register"} className="text-lg font-bold">
                                                <SignUpForm onClose={onClose} />
                                            </Tab>
                                        </Tabs>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </NavbarItem>
                )}

            </NavbarContent >
        </Navbar >
    );
}
