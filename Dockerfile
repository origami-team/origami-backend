FROM node:12.18.1-alpine
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
CMD yarn start
EXPOSE 3000