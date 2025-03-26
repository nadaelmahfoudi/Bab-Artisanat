FROM node:22.14.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the frontend port
EXPOSE 5173

# Use the start command
CMD ["npm", "run", "dev"]
