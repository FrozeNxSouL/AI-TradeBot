
import { prisma } from '@/lib/prisma_client';
import { stripe } from "@/lib/stripe";
import { PaymentStatus, UserStatus } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
    // try {
        const body = await request.text();
        const signature = request.headers.get("Stripe-Signature") as string;
    
        let event: Stripe.Event;
    
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!);
    
        } catch (error) {
            return new NextResponse("invalid signature", { status: 400 })
        }

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            // console.log("✅ Payment Success!");
            // console.log(paymentIntent)
            // console.log("📧 Customer name:", paymentIntent.metadata.customerName);
            // console.log("👤 User ID:", paymentIntent.metadata.userId);
            // console.log("FOR MT5 ID:", paymentIntent.metadata.forMT5id);
            // console.log("BIll ID:", paymentIntent.metadata.billid);
    
    
            const updatedBill = await prisma.billing.update({
                where: {
                    bill_id: Number(paymentIntent.metadata.billid),
                },
                data: {
                    bill_status: PaymentStatus.Done,
                }
            })
    
            const userID = paymentIntent.metadata.userid;

            const delaybills = await prisma.billing.findMany({
                where: {
                    bill_log: {
                        log_usage: {
                            usage_account: {
                                acc_user: {
                                    user_id: userID
                                }
                            }
                        }
                    },
                    bill_status : PaymentStatus.Delay
                },
            });

            if (delaybills.length <= 0) {
                const update_user = await prisma.user.findFirst({
                    where: {
                        user_id: userID,
                        user_status: UserStatus.Active
                    }
                });
            }
            return new NextResponse("ok", { status: 200 })
        } else {
            return NextResponse.json(
                { error: "Payment Intent Error" },
                { status: 400 }
            );
        }
        
    // } catch (error) {
    //     return NextResponse.json(
    //         { error: "Payment Error" },
    //         { status: 500 }
    //     );
    // }
}