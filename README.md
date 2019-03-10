# AREA

## Description

The goal of the Area project is to provide an social pool with somes services. This services can be control by some actions and can triggered a reaction component that will notificate the user.

We will provide 5 services and 12 actions/reactions components.

### Services

* Intra Epitech
* Office 365 Mail
* One Drive
* Facebook
* Timer

### Actions

### Reactions



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

Data to SEND: ```{ accessToken: String, userId: String }```  
  
Data to RECEIVE: ``` { logged: Boolean }``` 

#### Google

Method : **POST**  
URL : http://localhost:8080/api/registerGoogle/  

Data to SEND: ```{ idToken: String, token: String, mail: String, uid: String }```  
  
Data to RECEIVE: ``` { logged: Boolean }``` 

#### Instagram

Method : **POST**  
URL : http://localhost:8080/api/registerInstagram/  

Data to SEND: ```{ token: String }```  
  
Data to RECEIVE: ``` { logged: Boolean }``` 


### Widgets 

#### Description of Widgets

Value between [] is the id of widget.  

[0] : MailTimer -> Email you when it's time. Need 2 parameters: ```{ hour: Number, min: Number }```  

#### Add Widget

Method : **POST**  
URL : http://localhost:8080/api/addWidget/  

Data to SEND: ```{ id: Number, text: String, icon: String, parameters: Object }```  

Data to RECEIVE: ``` { logged: Boolean }``` 
