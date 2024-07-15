const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Define a schema for user data validation
const userSchema = Joi.object({
  firstName: Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required(),

  lastName: Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required(),

  email: Joi.string()
  .email({minDomainSegments: 2}).required(),

  DOB: Joi.date().iso().required().messages({
    'date.base': 'Invalid date format. Date should be in ISO format',
    'date.format': 'Invalid date format. Date should be in ISO format',
    'date.iso': 'Invalid date format. Date should be in ISO format',
    'any.required': 'Date of birth is required'
  })
});


let users = [
  {
    firstName: "John",
    lastName: "wick",
    email:"johnwick@gamil.com",
    DOB:"1990-01-22",
  },
  {
    firstName: "John",
    lastName: "smith",
    email:"johnsmith@gamil.com",
    DOB:"1983-07-21",
  },
  {
    firstName: "Joyal",
    lastName: "white",
    email:"joyalwhite@gamil.com",
    DOB:"1989-03-21",
  },
];

// GET request: Retrieve all users
router.get("/",(req,res)=>{
  res.send(users);

});

// GET by specific ID request: Retrieve a single user with email ID
router.get("/:email",(req,res)=>{

  try {
    const email = req.params.email;
    if(!email?.includes("@")){
      return res.status(400).send("Invalid email format");
    }

    const foundUserByEmail = users.find((user) => user.email === email);
    if(!foundUserByEmail){
      return res.status(404).send("User not found");
    }

    res.send(foundUserByEmail);
  } catch (error) {
    console.error(error);

    return res.status(500).send("Internal server error");
  }
});


// POST request: Create a new user using the data in the request body and the joi schema

// req.body is used to get the data from the body of the request
// Example: curl --header "Content-Type: application/json" --request POST --data '{"firstName":"John","lastName":"Doe","email": johndoe@email.com,"DOB":"01-01-1990"}' http://localhost:5000/user

// Envoyer les données en tant que données de formulaire :
/* Example: curl --header "Content-Type: application/x-www-form-urlencoded" \
     --request POST \
     --data "firstName=Jon&lastName=Lovato&email=jonlovato@theworld.com&DOB=10/10/1995" \
     http://localhost:5000/user
*/

router.post("/",async(req,res)=>{
  
  try {
    const {firstName,lastName,email,DOB} = req.body;
    
    // Validate the user data
    const value = await userSchema.validateAsync({firstName,lastName,email,DOB});
    
    // Check if the user already exists
    const foundUserByEmail = users.find((user) => user.email === email);
    if(foundUserByEmail){
      return res.status(409).send("User already exists");
    }

    users.push(value);
    res.send(`The user ${firstName} is added to the database`);
    console.log(users);
  } catch (error) {
    error.isJoi ? res.status(400).send(error.details[0].message) : res.status(500).send("Internal server error");
  }
});


// PUT request: Update the details of a user by email ID
router.put("/:email", async(req, res) => {

   try {
    const {email} = req.params;
    const validatedData = await userSchema.validateAsync(req.body);

    const userIndex = users.findIndex((user) => user.email === email);
    if(userIndex === -1){
      return res.status(404).send("User not found");
    }

    users[userIndex] = {...users[userIndex],...validatedData};
    res.send(`The user with email ${email} is updated`);
   } catch (error) {
    console.error(error);
    error.isJoi ? res.status(400).send(error.details[0].message) : res.status(500).send("Internal server error");
  
   }
});


// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
  // Copy the code here
  res.send("Yet to be implemented")//This line is to be replaced with actual return value
});

module.exports=router;
