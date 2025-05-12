FROM node:20-alpine

WORKDIR /app

# Install bash
RUN apk add --no-cache bash

COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 5000 9229

CMD ["npm", "run", "dev"]
