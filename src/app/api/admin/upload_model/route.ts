// app/api/upload-zip/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma_client';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const zipFile = formData.get('zipFile') as File;
        const currency = formData.get('currency') as string;
        const timeframe = formData.get('timeframe') as string;

        if (!zipFile || !currency || !timeframe) {
            return NextResponse.json(
                { success: false, message: 'File and new filename are required' },
                { status: 400 }
            );
        }

        // Validate file type
        if (zipFile.type !== 'application/x-zip-compressed') {
            return NextResponse.json(
                { success: false, message: 'Only ZIP files are allowed' },
                { status: 400 }
            );
        }

        // Create directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'model');

        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const findlast = await prisma.model.findFirst({
            where: {
                model_timeframe: timeframe,
                model_currency: currency
            }
        })

        if (!findlast) {

            const filePath = path.join(uploadDir, `${currency}_${timeframe}v1.zip`);
            const relativeFilePath = `model/${currency}_${timeframe}v1.zip`;

            // Convert file to buffer and save
            const fileBuffer = Buffer.from(await zipFile.arrayBuffer());
            await writeFile(filePath, fileBuffer);

            const insert = await prisma.model.create({
                data: {
                    model_timeframe: timeframe,
                    model_currency: currency,
                    model_version: 1,
                    model_path: relativeFilePath
                }
            })

            if (!insert) {
                return NextResponse.json(
                    { success: false, message: 'Error uploading file' },
                    { status: 500 }
                );
            } else {
                return NextResponse.json({
                    success: true,
                    message: 'File uploaded successfully',
                    filePath: relativeFilePath
                });
            }

        } else {
            const filePath = path.join(uploadDir, `${currency}_${timeframe}v${findlast.model_version + 1}.zip`);
            const relativeFilePath = `model/${currency}_${timeframe}v${findlast.model_version + 1}.zip`;

            // Convert file to buffer and save
            const fileBuffer = Buffer.from(await zipFile.arrayBuffer());
            await writeFile(filePath, fileBuffer);

            const insert = await prisma.model.create({
                data: {
                    model_timeframe: timeframe,
                    model_currency: currency,
                    model_version: findlast.model_version + 1,
                    model_path: relativeFilePath
                }
            })

            if (!insert) {
                return NextResponse.json(
                    { success: false, message: 'Error uploading file' },
                    { status: 500 }
                );
            } else {
                return NextResponse.json({
                    success: true,
                    message: 'File uploaded successfully',
                    filePath: relativeFilePath
                });
            }
        }


    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Error uploading file' },
            { status: 500 }
        );
    }
}

// Increase payload size limit for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};