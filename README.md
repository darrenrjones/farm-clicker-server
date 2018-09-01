# Farm Clicker Server


### Live client!



*View our [client side code here]().*

## Features



### Back-End Tech:
- jwt-decode
- Express
- bcrypt
- nodemon
- passport
- passport-jwt
- passport-local

Farm Clicker Server Endpoints
========================

# Parent Endpoints

Our parent calls to the endpoint will return updated authtokens that hold any updated data. The decoded JWT token will look like below: 

```
{
  
}
```


##PARENT ACCOUNT OPERATIONS

## PARENT ACCOUT LOGIN
- **POST/api/login**

### Request

``` 
    {
      "username": "user",
      "password": "password"
    }
```

###Response 

```
    {
      "authToken" : "authToken"
    } 
```

The decoded authToken will provide all the necessary data to render the pages (see above).
Upon error, we return an unauthorized error.

```
    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
```

##REGISTER NEW PARENT ACCOUNT
- **POST/api/parent** 

### Request

``` 
  //required {'username', 'password', 'email'};

    {
      "name": "user",
      "email": "user@hello.com",
      "username": "user",
      "password": "password"
    }

```

### Response 
```
    {
      "authToken" : "authToken"
    }

```
The decoded authToken will provide all the necessary data to render the pages (See top of section).

##DELETE PARENT ACCOUNT
- **POST/api/parent** 

### Response 
```
    {
      "status" : 204
    }

```

