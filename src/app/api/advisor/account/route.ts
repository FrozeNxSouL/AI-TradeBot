
import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { acc, id, client } = body;
    if (!acc || !id || !client) {
        return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { user_id: id }
        });
    
        if (!userExists) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }


        const searching = await prisma.account.findFirst({
            where: {
                acc_name: acc,
                acc_client: String(client),
                acc_user_id: id 
            }
        })

        if (searching) {
            return NextResponse.json({ error: "Account is already created" }, { status: 400 });
        } else {
            const newAccount = await prisma.account.create({
                data: {
                    acc_name: acc,
                    acc_client: String(client),
                    acc_user_id: id
                },
            });

            if (!newAccount) {
                return NextResponse.json({
                    error: "Error function",
                },{ status: 500 });
            } else {
                return NextResponse.json({
                    message: "Trade logs",
                },{ status: 200 });
            }
        }

    } catch (error:any) {
        return NextResponse.json({
            error: "Error prisma",
        }, {
            status: 500
        });
    }
}