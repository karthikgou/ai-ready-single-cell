FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mv -f /usr/src/app/configs/storageConfig_linux.json /usr/src/app/configs/storageConfig.json 
RUN mv -f /usr/src/app/configs/dbconfigs_linux.json /usr/src/app/configs/dbconfigs.json 

RUN mkdir -p /usr/src/app/storage/saketh.p/helo

EXPOSE 3001

CMD ["npm", "start"]

#FROM ubuntu:22.04
#RUN mkdir /var/ai-single-cell-node/
#COPY . /var/ai-single-cell-node/

#RUN apt-get -y update
#RUN apt-get -y install curl
#RUN apt-get -y install nodejs
#RUN apt-get -y install npm
#RUN mkdir /var/ai-single-cell-node/storage/
#RUN mkdir /var/ai-single-cell-node/storage/internal
#RUN mv -f /var/ai-single-cell-node/configs/storageConfig_linux.json /var/ai-single-cell-node/configs/storageConfig.json 
#RUN rm -r /var/ai-single-cell-node/node_modules
#RUN npm install
# RUN npm install react-scripts


#CMD ["npm", "start", "--prefix", "/var/ai-single-cell-node/"]
