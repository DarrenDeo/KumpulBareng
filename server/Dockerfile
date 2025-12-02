FROM node:20-alpine

WORKDIR /app

# Install OpenSSL (buat Prisma)
RUN apk add --no-cache openssl

# Install dependency
COPY package*.json ./
RUN npm install

# Copy semua source (termasuk prisma/schema.prisma)
COPY . .

EXPOSE 5000

ENV PORT=5000 \
    NODE_ENV=production

# Urutan:
# 1. Generate Prisma client
# 2. Apply migration
# 3. Start server
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]
