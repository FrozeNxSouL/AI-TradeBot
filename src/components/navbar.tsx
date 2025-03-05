"use client"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input"
import { LockIcon, MailIcon } from "./icon";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button"
// import {Tabs, Tab, Card, CardBody} from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import LoginForm from "./loginForm";
import SignUpForm from "./signUpForm";

export default function MainNavbar() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <Navbar className="flex bg-background opacity-95 border-b-primary border-b-2" maxWidth="full">
            <NavbarBrand>
                <Link href="/">
                    <p className="font-bold text-xl uppercase text-primary">money</p>
                    <p className="font-bold text-xl uppercase text-accent">glitch</p>
                </Link>

            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-7" justify="center">
                <NavbarItem className="hover:text-primary">
                    <Link color="foreground" className="hover:text-primary" href="/dashboard">
                        Dashboard
                    </Link>
                </NavbarItem>
                <NavbarItem className="hover:text-primary">
                    <Link color="foreground" className="hover:text-primary" href="/advisor">
                        Advisor
                    </Link>
                </NavbarItem>
                <NavbarItem className="hover:text-primary">
                    <Link color="foreground" className="hover:text-primary" href="/billing">
                        Billing
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button variant="bordered">User</Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dropdown menu with description" variant="shadow">
                            <DropdownItem
                                key="new"
                                description="Profile and Description"
                                className="text-background"
                            >
                                UserName
                            </DropdownItem>
                            <DropdownItem
                                key="copy"
                                description="Historical Trade Orders"
                                className="text-background"
                            >
                                Trade History
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                showDivider
                                description="Documentation for Trading System"
                                className="text-background"
                            >
                                Documentation
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                description="Logout from current user"
                                // startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                            >
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="ghost" onPress={onOpen}>
                        Sign In
                    </Button>

                    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} hideCloseButton>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    {/* <ModalHeader className="flex flex-col gap-1"> */}
                                    <Tabs
                                        aria-label="Dynamic tabs"
                                        fullWidth
                                        size="lg"
                                        variant="light"
                                    >
                                        {/* {(item) => ( */}
                                        <Tab key={0} title={"Login"} className="text-lg font-bold">
                                            <LoginForm onClose={onClose} />
                                        </Tab>

                                        <Tab key={1} title={"Register"} className="text-lg font-bold">
                                            <SignUpForm onClose={onClose} />
                                        </Tab>
                                        {/* )} */}
                                    </Tabs>
                                    {/* Log in

                                    </ModalHeader> */}

                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
