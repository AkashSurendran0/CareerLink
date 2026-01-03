# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js app
RUN npm run build


# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_GATEWAY_ROUTE=https://careerlink.ddns.net/api
ENV NEXT_PUBLIC_FRONTEND_ROUTE=https://careerlink.ddns.net
ENV NEXT_PUBLIC_MAX_AGE_1_HOUR=3600
ENV NEXT_PUBLIC_RAZORPAY_API_KEY=rzp_test_RlTalei3CXVNOp

# Copy required files only
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]
