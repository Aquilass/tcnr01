FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application
COPY . .

# Expose port
EXPOSE 3737

# Run the application
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "3737"]
