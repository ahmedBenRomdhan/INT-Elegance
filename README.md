# IntElegance
This application is the result of my during my end of studies project
it's a project management application that i developed during my internship in Sofiatech

## Technologies used 

- Node
- Express
- Angular
- Mysql (sequelize)
- Docker
- Socket.io

## What does this application provide
- Users and roles management
- Project managemet
- Task management
- Chat application (you can talk with other users in realtime)
- Calendar (to visualize your meetings)
- Dashboard in which you can visualize different KPIs charts and other useful informations


## How to run this application locally

1 - Clone the repo
2 - Make a database table called "int-elegance"
3 - cd backend then npm install
4 - open backend/src in the cmd then npx sequelize-cli db:migrate 
5 - cd frontend then npm i 
6 - run the backend (npm run start) and run the frontend (ng serve)
7 - once you run the backend an admin account will be created automatically by the application
8 - the credentials for the admin account can be found in yopmail.com (navigate to yopmail.com and search sofiatech2023@yopmail.com)
9 - if you want to receive the credentials in your personal email address change the email address in the app.js file (line 295)

## How to run this application using docker containers

- go to the config folder (backend/src/config)
- change the configuration for developement to this :
"development": {
    "username": "root",
    "password": "root",
    "database": "int-elegance",
    "host": "mysqldb",
    "dialect": "mysql",
    "logging":false
  }
- then navigate to the root folder where you can find the docker-compose.yml file
- and run docker compose up in the terminal.
- after the docker compose up finishes creatings containers you may need to bring them down (docker compose down) and the re-execute docker-compose up so the migrations container can do its work



