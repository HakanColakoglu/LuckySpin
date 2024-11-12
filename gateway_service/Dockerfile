# Step 1: Use a lightweight Node.js image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install only production dependencies
RUN npm install --only=production

# Step 5: Copy the compiled code and any additional files to the container
COPY dist ./dist

# Step 6: Specify the command to run the application
CMD ["node", "dist/app.js"]
