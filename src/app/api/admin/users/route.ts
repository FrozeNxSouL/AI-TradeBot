import { prisma } from "@/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { role, id } = body.data;
    if (!role || !id) {
        return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: {
                user_id: id,
            },
            data: {
                user_role: role,
            },
        });

        return NextResponse.json(
            { message: 'update completed' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const { id } = body.data;
    if (!id) {
        return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
    }

    try {
        await prisma.user.delete({
            where: {
                user_id: id,
            },
        });

        return NextResponse.json(
            { message: 'delete completed' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to deleting user' },
            { status: 500 }
        );
    }
}