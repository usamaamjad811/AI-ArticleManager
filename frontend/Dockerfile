# Dockerfile for Next.js frontend

# Use a compatible Node.js version
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json, then install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the Next.js application code
COPY . .

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]
