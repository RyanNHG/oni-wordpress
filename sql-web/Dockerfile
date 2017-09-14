FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install --silent
RUN npm install -g nodemon --silent

CMD ["npm", "run", "dev"]
