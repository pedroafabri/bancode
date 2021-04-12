# BanCode back-end API
This is the BanCode back-end API project for my programming classes.

## Running the application

### 0 - Install all dependencies
Install all dependencies with the following command:
```
npm install
```

### 1 - Configure .env file
The .env file must be configured followinf the .env.example file.
You can simply copy one file into another with the command:
```
cp .env.example .env
```

Below is an explanation of every config variable:
```
PORT=3000   // Application port
DB_URL=url // MongoDB connection URL
```

### 2 - Run the application
The application can be run in two ways:

#### 2.1 - Run as dev
Running as dev starts the application with nodemon to make changes quickly available.
```
npm run dev
```

#### 2.2 - Build & Start application
Building and Running is often used for production environment. Simply run:
```
npm start
```

## Commiting new code
Always make sure that your code meets the standards of this repo before commiting.
There's two checks that you must do:
- copy paste detection (*npm run jscpd*)
- standardjs detection (*npm run standard:fix*)

The pre-commit hook will **NOT** allow commits with codes not following [StandardJS](https://standardjs.com/).

## Available terminal commands
All the commands below are available to be used as pleased.

| Command      | Description                                                                                                  | Example              |
|--------------|--------------------------------------------------------------------------------------------------------------|----------------------|
| clean        | Removes the *build/* folder. Used before every build                                                         | npm run clean        |
| build        | Uses babel to build the application to the *build/* folder                                                   | npm run build        |
| start        | Calls clean, build and then starts the server located at *build/* folder                                     | npm start            |
| dev          | Runs the server with nodemon in development mode.                                                            | npm run dev          |
| test         | Runs jest to execute all test files                                                                          | npm run test         |
| standard     | Checks if the code meets [StandardJS](https://standardjs.com/) requirements.                                 | npm run standard     |
| standard:fix | Checks if the code meets [StandardJS](https://standardjs.com/) requirements and auto-fix some of the errors. | npm run standard:fix |
| jscpd        | Checks the *src/* folder for copy-pasted code.                                                               | npm run jscpd        |


# Creators
- [Pedro A. Fabri](https://github.com/pedroafabri) <<pedroafabri@gmail.com>>
- [Gabriel R. Veiga](https://github.com/veigacoder) <<gbrl316@gmail.com>>
- [Lucas M. Bosquetti](https://github.com/luk-jedi) <<lucas.zet@hotmail.com>>
- [Vinicius M. Ribeiro](https://github.com/vinicius-m9) <<viniciusmachadoribeiro@hotmail.com>>
- [Matheus H. Soares](https://github.com/Narval1) <<matheushsm71@gmail.com>>