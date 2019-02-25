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

### Authentification 

#### Basic Sign Up

Method : **POST**  
URL : http://localhost/api/signup/  
  
Data to SEND: ``` javascript {
            fname : String,  
            lname : String,  
            mail : String,  
            password : String 
        } ```  
        
Data to RECEIVE: ```javascript {  
            register: Boolean,  
            token: {  
                id: String,  
                since: Number,  
                validity: Number  
            },  
            userId: String  
        }```  
