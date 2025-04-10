
import { prisma } from "@/lib/prisma_client";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Return signup result
 *     responses:
 *       200:
 *         description: successful response
 *       500:
 *         description: internal server error
 */

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, password, repass } = body.data;
    if (!email || !password || !repass) {
        return NextResponse.json({ error: 'Please fill out all required fields' })
    }

    if (password !== repass) {
        return NextResponse.json({ error: 'Passwords do not match' })
    }

    const exist = await prisma.user.findFirst({
        where: {
            user_email: email
        }
    });
    if (exist) {
        return NextResponse.json({ error: 'This email is already registered' })
    }

    const hashedPassword = await hashSync(password, 10);
    await prisma.user.create({
        data: {
            user_email: email,
            user_password: hashedPassword
        }
    })
    return NextResponse.json({ status: 200 });
}