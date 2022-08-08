FROM node:14

WORKDIR /var/app
COPY ./package.json /var/app/package.json
RUN npm install
COPY ./ /var/app/
RUN npm run build


ENV PORT 8080
CMD ["npm", "start"]