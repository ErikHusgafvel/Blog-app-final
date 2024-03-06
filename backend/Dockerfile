FROM node:21.6-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
# install nodemon for hot-reloading
RUN npm install -g nodemon
COPY . .
CMD npm run dev