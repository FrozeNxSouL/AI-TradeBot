import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../../../../swaggerConfig'; // adjust path
import { NextRequest } from 'next/server';

const specs = swaggerJsdoc(swaggerOptions);


export async function GET(req: NextRequest) {
  return new Response(
    JSON.stringify(specs),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
