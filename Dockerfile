FROM node:12.18.1-alpine
WORKDIR /app
COPY package.json /app
RUN yarn
COPY ./src /app/src
CMD yarn start
EXPOSE 3000