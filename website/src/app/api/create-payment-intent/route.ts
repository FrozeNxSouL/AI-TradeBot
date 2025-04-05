
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /create-payment-intent:
 *   post:
 *     summary: Returns created payment intent
 *     responses:
 *       200:
 *         description: successful response
 *       400:
 *         description: False Input
 *       500:
 *         description: Prisma fail in progress
 */

export async function POST(request: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    try {
        const body = await request.json();
        const { amount, billID, userID } = body.data;
        if (!amount || amount < 0 || !billID || !userID) {
            return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "thb",
            automatic_payment_methods: { enabled: true },
            metadata: {
                billid: billID,
                userid: userID
            }
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Payment Error" },
            { status: 500 }
        );
    }
}