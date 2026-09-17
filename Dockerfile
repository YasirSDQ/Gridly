FROM node:20-slim

# Install unzip and curl for rclone
RUN apt-get update && apt-get install -y unzip curl

WORKDIR /app
COPY package*.json ./

# Install dependencies and run postinstall (which installs rclone)
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
