import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /advisor/find_acc:
 *   post:
 *     summary: Returns searched account result
 *     responses:
 *       200:
 *         description: successful response
 *       400:
 *         description: False Input
 *       500:
 *         description: Prisma fail in progress
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body.data;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch Account and Model data in parallel
        const accounts = await prisma.account.findMany({
            where: {
                acc_user_id: id
            },
            include: {
                acc_usage: true
            }
        })

        return NextResponse.json({ accounts }, { status: 200 });

    } catch {
        return NextResponse.json({ message: "Error fetching data", error: "Error fetching data" }, { status: 500 });
    }
}
