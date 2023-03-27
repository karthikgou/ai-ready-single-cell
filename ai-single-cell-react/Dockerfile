FROM node:14
# Create app directory
WORKDIR /opt/src/app
# Install app dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .
#RUN sudo apt-get install unzip 
#RUN unzip node_modules.zip -d /usr/src/app/
# RUN mkdir -p /usr/src/app/node_modules/@uppy 
# RUN mkdir -p /usr/src/app/node_modules/@fortawesome 
# RUN mv -f /opt/src/app/manual_deps/@uppy/ /usr/src/app/node_modules/@uppy 
# RUN mv -f /opt/src/app/manual_deps/@fortawesome/ /usr/src/app/node_modules/@fortawesome 
RUN npm i -S @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome
RUN export HOST_IP=$(sh -c "ip route | awk 'NR==1 {print \$3}'")


#Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]
