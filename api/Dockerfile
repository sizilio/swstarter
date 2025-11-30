FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application (tsx watch for development)
CMD ["npm", "run", "dev"]
