// swaggerConfig.ts
export const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Next.js API',
        version: '1.0.0',
        description: 'API documentation for Next.js 15 app',
      },
      servers: [
        {
          url: 'http://localhost:3000/api', // Adjust if you're deploying
        },
      ],
    },
    apis: ['./src/app/api/**/*.ts'], // Route handler files with comments
  };
  