
import { prisma } from "@/lib/prisma_client";
import { hashSync } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, password } = body.data;
    if (!email || !password) {
        return NextResponse.json({ error: 'Please fill out all required fields' })
    }
    const hashedPassword = await hashSync(password, 10);
    const exist = await prisma.user.findFirst({
        where: {
            user_email: email,
            user_password: hashedPassword
        }
    });
    if (exist) {
        return NextResponse.json({ status: 200 });
    }
    else {

    }
    return NextResponse.json({ status: 400 });
}