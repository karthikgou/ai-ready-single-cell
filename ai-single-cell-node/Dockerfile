FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mv -f /usr/src/app/configs/storageConfig_linux.json /usr/src/app/configs/storageConfig.json 
RUN mv -f /usr/src/app/configs/dbconfigs_linux.json /usr/src/app/configs/dbconfigs.json 

RUN mkdir -p /usr/src/app/storage/saketh.p/helo

EXPOSE 3001

CMD ["npm", "start"]
