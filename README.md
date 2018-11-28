# Farm Clicker Tycoon Server

* [Play Live](https://farmclickertycoon.herokuapp.com/)

* [Client Repo](https://github.com/darrenrjones/farm-clicker)

## Pre

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

A step by step series of examples that tell you how to get a development env running

First clone the [Server](https://github.com/darrenrjones/farm-clicker-server) and setup your own MLab database called 'farm-clicker', then add a user with password which you will need to add to the .env file in the steps below:

```
cd farm-clicker-server
```

```
npm install
```

```
create .env file in root
```
From https://mlab.com/databases/farm-clicker copy the MongoDB URI and add it to the .env file. the MongoDB URI will will look like this: 

mongodb://<dbuser>:<dbpassword>@l3tterSn3tuff.mlab.com:41622/farm-clicker

Then create a jwt secret to add to the .env file. This can be anything you want, but keep it secure.

Your .env file will not look like this:

```
DATABASE_URL='mongodb://<dbuser>:<dbpassword>@l3tterSn3tuff.mlab.com:41622/farm-clicker'
JWT_SECRET='put-your-custom-jwt-secret-here'
```

In terminal run
```
node seed-db.js
```

Now in mlab you should have "Animals", "Crops", and "Users" collections. You can sign in with these accounts for testing and reset them by running the above seed-db.js code again.

Username: farmDummy pswrd: password
Username: farmSmartie pswrd: password
Username: farmGod pswrd: password



# Farm Clicker Server Endpoints
========================

## Login

You can log in via postman with a POST request to : 

localhost:8080/api/login

In the body tick the raw radio/bubble and select JSON(application/json) in the drop down menu

In the text input put the JSON object to log in like so : 

```
{
	"username": "farmSmartie",
	"password": "password"
}
```

This will return a large JWT token which you can decode at https://jwt.io/ to see the user object that will be used via React.

## Register

You can register via postman with a POST request to : 

localhost:8080/api/user/register

In the body tick the raw radio/bubble and select JSON(application/json) in the drop down menu

In the text input put the JSON object to log in like so : 

```
{
	"username": "tester",
	"password": "examplePassword",
	"farmname": "tester's farm"
}
```

# Testing

run npm test via node to run the tests

### Back-End Tech:
- jwt-decode
- Express
- bcrypt
- nodemon
- passport
- passport-jwt
- passport-local
- chai
- mocha


## Author

* **Darren Jones** - [Portfolio](https://DarrenRaymondJones.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

