
FROM node:18-alpine AS dependencies

WORKDIR /dependencies

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

FROM node:18-alpine AS app

WORKDIR /app

COPY --from=dependencies /dependencies/node_modules ./node_modules
COPY . .
COPY prisma ./prisma

# ENV NODE_ENV=production
# ENV NODE_OPTIONS=--max-old-space-size=2048
# ENV NEXT_IGNORE_TYPE_ERRORS=true
# ENV NEXT_DISABLE_ESLINT=true

RUN npx prisma generate

# RUN npm run build

EXPOSE 3000
# CMD ["npm", "run", "dev"]
# CMD ["sh", "-c", "node src/utils/server.js & npm start"]
CMD ["sh", "-c", "node src/utils/server.js & npm run dev"]


# Use Node.js base image
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the rest of the app files
# COPY . .

# # Start the app
# CMD ["node", "server.js"]

# Install dependencies
# FROM node:18-alpine AS dependencies
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install

# # Build the application
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Build the Next.js app
# RUN npm run build

# # Create a lightweight production image
# FROM node:18-alpine AS runner
# WORKDIR /app

# # Copy built files and node_modules
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/src/utils/server.js ./server.js 

# # Set environment variables
# ENV NODE_ENV=production

# # Expose port
# EXPOSE 3000

# # Run both Next.js and server.js
# CMD ["sh", "-c", "node server.js & npm run start"]

