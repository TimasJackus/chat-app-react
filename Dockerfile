# build environment
FROM node:10 as build
WORKDIR /react
ENV PATH /react/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx

WORKDIR /root/
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./react/build /app

EXPOSE 80