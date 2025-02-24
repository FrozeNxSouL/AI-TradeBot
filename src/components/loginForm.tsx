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
import { LockIcon, MailIcon } from "./icon";


export default function LoginForm({ onClose }: {onClose: () => void}) {

    return (
        <>
            <ModalBody>
                <Input
                    endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                />
                <Input
                    endContent={
                        <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                    <Link color="primary" href="#" size="sm">
                        Forgot password?
                    </Link>
                </div>
            </ModalBody>
            <ModalFooter>
                {/* <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                </Button> */}
                <Button color="primary" onPress={onClose} className="w-full font-semibold">
                    Enter
                </Button>
            </ModalFooter>
        </>
    );
}
