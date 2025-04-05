
import { prisma } from "@/lib/prisma_client";
import { compare, hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /modify_account:
 *   post:
 *     summary: Return account modification status
 *     responses:
 *       200:
 *         description: Status of modification
 */

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        id,
        email,
        card,
        group_password
    } = body;

    if (group_password) {
        if (group_password.new1 != group_password.new2) {
            return NextResponse.json({ error: 'New passwords not matched' });
        }
        const userData = await prisma.user.findFirst({
            where: {
                user_id: id
            },
            select: {
                user_password: true,
            }
        });
        if (!userData || !userData.user_password) {
            return NextResponse.json({ error: 'User not found' });
        }

        const matched = await compare(group_password.current, userData.user_password);
        if (!matched) {
            return NextResponse.json({ error: 'Current password is incorrect' });
        }
        const hashedPassword = await hashSync(group_password.new1, 10);
        try {
            await prisma.user.update({
                where: {
                    user_id: id
                },
                data: {
                    user_email: email,
                    user_card: card,
                    user_password: hashedPassword
                }
            });

            return NextResponse.json({ status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'error in API' });
        }
    } else {
        try {
            await prisma.user.update({
                where: {
                    user_id: id
                },
                data: {
                    user_email: email,
                    user_card: card,
                }
            });
            
            return NextResponse.json({ status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'error in API' });
        }
    }

}