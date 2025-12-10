# Stage 1: Build Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifest dan config
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY eslint.config.mjs ./
#COPY .env.local ./.env.local

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy source dan public
COPY src ./src
COPY public ./public

# Install dependencies dan build
RUN npm install
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy semua yang dibutuhkan dari builder (termasuk node_modules)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
