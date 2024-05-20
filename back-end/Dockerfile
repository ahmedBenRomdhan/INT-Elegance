

# Use official node image as the base image
FROM node:14.15.0 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY . /usr/local/app/

# Install all the dependencies
RUN rm -rf node_modules
RUN npm install 

# Generate the build of the application
EXPOSE 3000
CMD npm run start


