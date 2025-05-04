# for development

FROM node as dev

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 3008:3008


CMD [ "npm", "run", "dev" ]

# for production

FROM node as prod

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 3008:3008


RUN [ "npm", "run", "build" ]

CMD [ "npm", "start" ]
