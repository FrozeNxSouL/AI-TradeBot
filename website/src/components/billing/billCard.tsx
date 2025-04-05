"use client"
import { BillsPayload, PaymentStatus } from "@/types/types";
import { CalendarIcon, CheckCircle, CurrencyIcon, ListIcon, MoneySVG, PaymentIcon, TrendingUpIcon, WatchLater } from "@/utils/icon";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./checkoutPage";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "")

export default function BillCard({ input, fee, userID }: { input: BillsPayload, fee: number, userID: string }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const profitPercentage = ((input.bill_log.log_profit * 100) / input.bill_log.log_balance).toFixed(2);

    // Determine status color and icon
    const getStatusDetails = () => {
        let output: { color: "warning" | "danger" | "success" | "default" | "foreground" | "primary" | "secondary", icon: any }
        switch (input.bill_status) {
            case PaymentStatus.Arrive:
                output = {
                    color: "warning",
                    icon: <MoneySVG className="w-5 h-5 text-secondary" />
                };
                return output
            case PaymentStatus.Delay:
                output = {
                    color: "danger",
                    icon: <WatchLater className="w-5 h-5 text-danger" />
                };
                return output
            default:
                output = {
                    color: "success",
                    icon: <CheckCircle className="w-5 h-5 text-primary" />
                };
                return output
        }
    };

    const statusDetails = getStatusDetails();

    const positive = Math.round(Math.abs(input.bill_cost * 100))

    return (
        <>
            <Card
                className="w-full mb-4 border-2 border-default-200 hover:shadow-lg transition-all duration-300"
                shadow="sm"
            >
                <CardBody className="flex flex-row p-0">
                    {/* Status Column */}
                    <div className="flex flex-col items-center justify-center w-1/12 bg-foreground text-background rounded-l-lg p-2">
                        <Tooltip content={PaymentStatus[input.bill_status]} color={statusDetails.color || "success"}>
                            <div className="flex flex-col items-center">
                                {statusDetails.icon}
                                <p className="text-xs mt-1 text-center">
                                    {PaymentStatus[input.bill_status]}
                                </p>
                            </div>
                        </Tooltip>
                    </div>

                    {/* Bill Details Column */}
                    <div className="flex flex-col justify-evenly w-3/12 p-4 border-x border-default-200">
                        <div className="flex items-center mb-2">
                            <CalendarIcon className="w-4 h-4 mr-2 text-default-500" />
                            <p className="text-sm">
                                Created: {new Date(input.bill_create_date).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center mb-2">
                            <CurrencyIcon className="w-4 h-4 mr-2 text-default-500" />
                            <p className="text-sm">
                                {input.bill_log.log_usage.usage_currency} {input.bill_log.log_usage.usage_timeframe}
                            </p>
                        </div>

                        <div className="flex items-center mb-2">
                            <WatchLater className="w-4 h-4 mr-2 text-default-500" />
                            <p className="text-sm">
                                Collection: {new Date(input.bill_log.log_start_date).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center">
                            <ListIcon className="w-4 h-4 mr-2 text-default-500" />
                            <p className="text-sm">
                                Total Trades: {input.bill_log.log_trades.length} orders
                            </p>
                        </div>

                        <div className="flex items-center mt-2">
                            <Chip
                                color="primary"
                                variant="dot"
                                className="text-background bg-foreground mr-2"
                            >
                                {input.bill_log.log_usage.usage_account.acc_client}
                            </Chip>
                            <p className="text-sm">
                                {input.bill_log.log_usage.usage_account.acc_name}
                            </p>
                        </div>
                    </div>

                    {/* Profit Column */}
                    <div className="flex flex-col justify-center w-5/12 p-4 border-r border-default-200">
                        <div className="flex items-center mb-2">
                            <MoneySVG className="w-5 h-5 mr-2 text-success" />
                            <p className="text-lg font-bold text-success">
                                Profit: {input.bill_log.log_profit.toFixed(2)} $
                            </p>
                        </div>

                        <div className="flex items-center">
                            <TrendingUpIcon className="w-5 h-5 mr-2 text-default-500" />
                            <p className="text-sm text-default-600">
                                Profit Percentage: {profitPercentage}%
                            </p>
                        </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col justify-around w-3/12 bg-foreground text-background rounded-r-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm">Total Commission:</p>
                            <p className="font-semibold text-xl">{(input.bill_cost).toFixed(2)} $</p>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm">Commission Rate:</p>
                            <p className="font-bold">{fee}%</p>
                        </div>

                        {input.bill_status !== PaymentStatus.Done && (
                            <>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm">Expiry Date:</p>
                                    <p className="font-bold">
                                        {new Date(input.bill_expire_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button
                                    onPress={onOpen}
                                    color="secondary"
                                    variant="shadow"
                                    className="mt-4 w-full"
                                    startContent={<PaymentIcon className="w-5 h-5" />}
                                >Pay Bill
                                </Button>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>

            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                motionProps={{
                    variants: {
                        enter: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                        exit: {
                            y: -20,
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn",
                            },
                        },
                    },
                }}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-background p-5 bg-foreground text-2xl">Payment</ModalHeader>
                            <ModalBody>
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        mode: "payment",
                                        amount: Math.abs(positive),
                                        currency: "thb"
                                    }}
                                >
                                    <CheckoutPage amount={Math.abs(positive)} billID={input.bill_id} userID={userID} />
                                </Elements>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
