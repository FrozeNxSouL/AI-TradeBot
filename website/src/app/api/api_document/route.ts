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

// // src/app/api/docs/route.ts
// import { NextRequest } from 'next/server';
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from '/swaggerConfig';
// import express from 'express';
// import { createServer } from 'http';

// const app = express();
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // 👇 Wrap the express app in a Next.js handler
// export const GET = async (req: NextRequest) => {
//   return new Response(JSON.stringify(swaggerSpec), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// };
