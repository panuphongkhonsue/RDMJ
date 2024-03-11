# Use the official Node.js 18 Alpine image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app
COPY package*.json ./

# Copy package.json and package-lock.json
# Since you're mounting the ./server directory, you don't need to copy application files explicitly

# Install nodemon globally
RUN npm install -g nodemon

# Install dependencies
# No need to run npm install if you're mounting the ./server directory

# Rebuild bcrypt native addons
RUN npm rebuild bcrypt --build-from-source

RUN npm install
COPY . .
# Expose port 3000
EXPOSE 3000

# Set the default command to run your application
CMD ["npm", "run", "dev"]

