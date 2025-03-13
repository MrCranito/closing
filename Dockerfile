FROM node:23-alpine3.20

# bash & curl are installed for clever ssh debugging purposes
# git & openssh are installed for getting packages from Gitlab
# build-base & python3 are installed for node-gyp
RUN apk --no-cache add bash curl git openssh build-base python3

WORKDIR /var/www

COPY package*.json ./
RUN npm install

RUN npm ci
COPY . ./

RUN npm run build

EXPOSE 8080
 
CMD npm 