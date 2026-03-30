FROM node:20-alpine

WORKDIR /app

# Install dependencies separately to leverage Docker caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Match the port in vite.config.js
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
