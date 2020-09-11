FROM node:12
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json /usr/app/

RUN yarn
COPY . /usr/app
#a
EXPOSE 3333

CMD ["yarn","debug"]