FROM node:16-alpine
WORKDIR /app
COPY package.json /app
RUN yarn
COPY ./src /app/src
CMD yarn start
EXPOSE 3000