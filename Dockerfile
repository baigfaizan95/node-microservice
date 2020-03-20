FROM node:10 as internode

# Work directory
RUN mkdir /app
WORKDIR /app

# Install dependencies
ADD package.json ./
RUN npm i

# Install pm2
RUN npm i -g pm2

# Add all files
ADD . /app

# Run application

EXPOSE 8000
CMD ["pm2", "start", "process.json", "--no-daemon"]
