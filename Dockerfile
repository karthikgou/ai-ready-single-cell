FROM ubuntu:22.04
RUN mkdir /var/ai-single-cell-react/
COPY . /var/ai-single-cell-react/

RUN apt-get -y update
RUN apt-get -y install curl
RUN apt-get -y install nodejs
RUN apt-get -y install npm
# RUN npm install react-scripts

CMD ["npm", "start", "--prefix", "/var/ai-single-cell-react/"]
