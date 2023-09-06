# Digital Learners Passbook

The Learners Passbook will act as a digital passbook for access by relevant stakeholders wherein it will comprise of digitally verifiable credentials and documents of the learner. The passbook will act as a log of the skills, capabilities, and achievements of the learner. At every touchpoint of the learner journey starting from admission till his employment, there is a need for easily accessible, readable and verifiable credentials.

## Development server
The Tech Stack used for this project is Angular for the frontend and NodeJS for the backend. Along with that styling has been applied using Bootstrap and the different libraries used are mentioned below.


## Frontend

### Setup
1.To install the Angular CLI, open a terminal window and run the following command:
npm install -g @angular/cli </br>
2 Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files..

### Folder Structure of frontend
     app
     │   ├── auth
     │   └── home
     │        │     ├── dlp  (this contains the components of differnet kind of certificates)
     │        │     ├──co-curricular
     │        │     ├── table   (This component is usefull for displaying the tabular data) 
     │        │     └──user     (This component is usefull for displaying the user data) 
     │        │
     │        └──  HelperInterface  (This contains Data structre of user details and certifactes)
     │                         ├──CertificateData
     │                         └──UserData
     │
     └───────────────────────────services (Folder to provide abstraction of functions)
    

## Backend
The backend is built using NodeJs and ExpressJs </br>
Install the NodeJs library inorder to run backend service : [Download NodeJs](https://nodejs.org/en/download)

### Commands to run backend
1. Change the current directory by using  : cd passbook-backend
2. run npm i to install all  libraries and dependencies.

### Folder Structure of frontend
     passbook-backend
                   └─── routes  (This contains all the router that are used in this project)
                  
                   └──index.js
                   
