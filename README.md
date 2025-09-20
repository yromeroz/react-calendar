## Project: react-calendar
Rooms and Courses Reservation Scheduler (looks like Google Calendar)

Features:
* Rooms and Courses Reservation
* Responsive  design

## Prerequisites
* [Node js](https://nodejs.org/)  v18.x or superior
* [MySQL](https://dev.mysql.com/) v8.x or superior

## Download project
```sh
git clone https://github.com/yromeroz/react-calendar.git
```

### Install dependencies
The project dependencies are listed in the `package.json` file. First, navigate to the folder that contains the `package.json` file before running the command below. 
```sh
npm install
```

### DB configuration
Create a .env file in the root directory and add the following variables `DATABASE_URL`, `PORT`:

`DATABASE_URL='mysql://dbuser:dbpass@host:3306/calendardb'`

`PORT=3000`
> Note: use `NODE_ENV=production` if you want to run the project in production mode

### Run project
When you run the project, the project will be available at http://localhost:3000 :
```sh
npm run dev
```

## DOCKER
#### Build docker image
```sh
docker build -t calendar-app .
```
#### Run docker image and create containers
```sh
docker compose up --build -d
```
#### Show logs of service nextjs
```sh
docker compose logs -f nextjs
```
#### Stop docker containers
```sh
docker compose down
```