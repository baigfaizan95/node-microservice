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

# Add docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Run application
EXPOSE 8000
CMD ["pm2", "start", "process.json"]
