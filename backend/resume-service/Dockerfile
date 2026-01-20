# ---------- Build Stage ----------
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Production Stage ----------
FROM node:20-slim

# Install Chromium + fonts
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libnss3 \
  libxss1 \
  libasound2 \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5006

CMD ["node", "dist/server.js"]
