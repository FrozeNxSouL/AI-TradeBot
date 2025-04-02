# # syntax=docker/dockerfile:1



FROM node:18-alpine AS dependencies

WORKDIR /dependencies

COPY package.json package-lock.json ./

RUN npm install


FROM node:18-alpine AS app

WORKDIR /app

COPY --from=dependencies /dependencies/node_modules .
COPY . .

# RUN npx prisma db push
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]


# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Start the app
CMD ["node", "server.js"]

# RUN npm run build
# CMD ["npm", "run", "dev"]
# # Copy rest of the application files
# COPY . .

# # Build the app (if needed)


# # Start the application
# CMD ["npm", "run", "dev"]
