# Build Stage
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Run Prisma migrations and generate the client
# RUN npx prisma generate

# Build the application
RUN yarn build

# Production Stage
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the build artifacts and Prisma client from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules/
#COPY --from=build /app/prisma ./prisma
#COPY --from=build /app/.env.docker .env

# Install production dependencies
COPY package.json yarn.lock ./
#RUN yarn install --production

# Expose the port the app will run on
EXPOSE 3005

# Command to run the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]