#Specify base image
FROM node:alpine

#Specify working directory
WORKDIR /app

#Copy package.json
COPY package.json ./

#install dependencies
RUN npm install

#copy rest of the contents in the folder
COPY ./ ./

#start application
#The cmd specified inside CMD will only be run when run the image to start a container
#and not during the creation of the image
CMD ["npm", "start"]