
# Use official node image as the base image
FROM node:14.15.0 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY . /usr/local/app/

# Install all the dependencies
RUN npm install --legacy-peer-deps

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/materialpro /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
