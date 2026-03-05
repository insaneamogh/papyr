# Papyr Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Expose backend URL to frontend
ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api

CMD ["npm", "start"]
