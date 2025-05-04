FROM node

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 3006:3006


CMD [ "node", "--watch", "app" ]