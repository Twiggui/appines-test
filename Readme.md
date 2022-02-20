# LAUNCH PROJECT ON DOCKER

..\* If this is the first time you open the project, follow the instructions in paragraph "CREATE DOCKER CONTAINER" below. This will create the Docker container on your device.
..\* If you already have the docker container but you pulled the project, follow the instructions in paragraph "UPDATE LOCAL CONTAINER". This will replace the existing image and restart the container

## CREATE DOCKER CONTAINER

After cloning the project, you need to create the docker container.
Docker container is created from "Dockerfile" and "docker-compose.yml" files in the project folder

..\* Install Docker if necessary : https://docs.docker.com/get-docker/
..\* Run the command :

```
docker-compose up -d --build
```

The container should run on 5565 port.

# UPDATE LOCAL CONTAINER

After pulling the project, you need to update the docker container with following commands :

```
docker-compose up --force-recreate --build -d
docker image prune -f
```

This will rebuild images and restart the container.

## CONNECT MONGO DATABSE IN THE CONTAINER

The mongo database is available through your IP adress when container is running

..\* Run the command ipconfig
..\* Find IPv4 adress
..\* Connect to mongo with this URI : mongodb://[YOUR IP ADRESS]:27017/appines?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
