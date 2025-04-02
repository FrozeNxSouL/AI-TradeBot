"use client"
import { Button } from "@heroui/button";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

export default function CheckoutPage({ amount, billID , userID}: { amount: number, billID: number, userID:string }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [clientSecret, setCilentSecret] = useState("");
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        async function fetchData() {
            // Reset states
            setLoading(true);

            console.log("in check ", amount)
            const response = await fetch('/api/create-payment-intent', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: { amount, billID, userID } })
            })
                .then((res) => res.json())
                .then((output) => setCilentSecret(output.clientSecret))
            setLoading(false);
        }
        fetchData();
    }, [amount]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        if (!stripe || !elements) {
            return
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            setErrorMsg(submitError.message || "")
            setLoading(false)
        }
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: { return_url: `http://localhost:3000/billing` },
        })

        if (error) {
            setErrorMsg(error.message || "")
        }
        setLoading(false)
    }

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center pb-10">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {clientSecret && <PaymentElement />}
            {errorMsg && <p className="text-danger">{errorMsg}</p>}
            <div className="w-full flex flex-col my-1 p-2 gap-2">
                {!loading ? (
                    <div className="w-full flex justify-between">
                        <p className="text-foreground font-semibold text-lg">Total Commission:</p>
                        <p className="text-foreground font-medium text-lg">{amount / 100} $</p>
                    </div>

                ) : (
                    <div className="w-full flex justify-between">
                        <p className="text-foreground font-medium text-md">Processing...</p>
                    </div>
                )}
                <Button type="submit" disabled={!stripe || loading} color="secondary" className="text-foreground font-semibold">Pay</Button>
            </div>
        </form>
    );
}
