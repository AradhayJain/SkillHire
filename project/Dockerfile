# ./project/Dockerfile

# --- Stage 1: Build the React/Vue/etc. Application ---
FROM node:lts-alpine AS build-stage

# Declare the build arguments that will be passed from docker-compose
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG SOCKET_URL
ARG AI_SOCKET_URL

# Set them as environment variables inside this build stage
# This makes them accessible to the `npm run build` command
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV SOCKET_URL=$SOCKET_URL
ENV AI_SOCKET_URL=$AI_SOCKET_URL

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Create the production build. The ENV variables will be used here.
RUN npm run build

# --- Stage 2: Serve the built application with Nginx ---
FROM nginx:stable-alpine AS production-stage

# Copy the static files from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# The default Nginx command will start the server automatically
