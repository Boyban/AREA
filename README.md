# AREA

## Description

The goal of the Area project is to provide an social pool with somes services. This services can be control by some actions and can triggered a reaction component that will notificate the user.

We will provide 5 services and 12 actions/reactions components.

### Services

* Facebook
* Google
* Instagram
* Weather
* Timer

### Actions

* Reach a picked time.

### Reactions

* Send an email


## API

This section will describe how to use the API. All the sections will use server address as "localhost".
You need to use the JSON format to send information.

### Authentication 

#### Basic Sign Up

Method : **POST**  
URL : http://localhost:8080/api/signup/  
  
Data to SEND: ```{
            fname : String,  
            lname : String,  
            mail : String,  
            password : String 
        } ```  
        
Data to RECEIVE: ```{  
            register: Boolean,  
            token: {  
                id: String,  
                since: Number,  
                validity: Number  
            },  
            userId: String  
        }```  
        
#### Basic Sign In

Method : **POST**  
URL : http://localhost:8080/api/signin/  

Data to SEND: ```{ mail: String, password: String }```  
  
Data to RECEIVE: ``` { logged: Boolean, userId: String, token: { id: String, since: Number, validity: Number}}```  

#### Facebook Sign Up

Method : **POST**  
URL : http://localhost:8080/api/signupFacebook/  
  
Data to SEND: ```{
            accessToken : String,  
            userId : String  
        } ```  
        
Data to RECEIVE: ```{  
            register: Boolean,  
            token: {  
                id: String,  
                since: Number,  
                validity: Number  
            },  
            userId: String  
        }```  

#### Facebook Sign In

Method : **POST**  
URL : http://localhost:8080/api/signinFacebook/  

Data to SEND: ```{ accessToken: String, userId: String }```  
  
Data to RECEIVE: ``` { logged: Boolean, userId: String, token: { id: String, since: Number, validity: Number}}```  

#### Basic User Info

Method : **GET**  
URL : http://localhost:8080/api/user/  
Headers : ```{'Authorization': String}```  
  
Data to RECEIVE: ```{fname: String, lname: String, mail: String}``` 

### Register Service

#### Facebook

Method : **POST**  
URL : http://localhost:8080/api/registerFacebook/ 
Headers : ```{'Authorization': String}``` 

Data to SEND: ```{ accessToken: String, userId: String }```  
  
Data to RECEIVE: ``` { logged: Boolean }``` 

#### Google

Method : **POST**  
URL : http://localhost:8080/api/registerGoogle/  
Headers : ```{'Authorization': String}``` 

Data to SEND: ```{ idToken: String, token: String, mail: String, uid: String }```  
  
Data to RECEIVE: ``` { logged: Boolean }``` 

#### Instagram

Method : **POST**  
URL : http://localhost:8080/api/registerInstagram/  

Data to SEND: ```{ token: String }```  
  
Data to RECEIVE: ``` { logged: Boolean }``` 


### Widgets 

#### Description of Widgets

Value between first [] is the id of widget.  
Value between second [] is the services ID of widget.  

Services ID List : 
* 0 : Timer
* 1 : Weather

[0][0] : MailTimer -> Email you when it's time. Need 2 parameters: ```{ hour: Number, min: Number }```  
[1][1] : MailWeaherU -> Email you when the weather in a location is under the temperature. Need 2 parameters: ```{ temp: Number, loc: String }```  
[2][1] : MailWeatherO -> Email you when the weather in a location is over the temperature. Need 2 parameters: ```{ temp: Number, loc: String }```  

#### Add Widget

Method : **POST**  
URL : http://localhost:8080/api/addWidget/  
Headers : ```{'Authorization': String}``` 

Data to SEND: ```{ id: Number, text: String, icon: String, parameters: Object }```  

Data to RECEIVE: ``` { logged: Boolean }``` 

#### Remove Widget

Method : **POST**  
URL : http://localhost:8080/api/unsubscribe/  
Headers : ```{'Authorization': String}``` 

Data to SEND: ```{ text: String }```  

Data to RECEIVE: ``` { logged: Boolean }``` 
