const express = require('express');
const router = express.Router();


let users = [
    {
        firstName: "John",
        lastName: "wick",
        email:"johnwick@gamil.com",
        DOB:"22-01-1990",
    },
    {
        firstName: "John",
        lastName: "smith",
        email:"johnsmith@gamil.com",
        DOB:"21-07-1983",
    },
    {
        firstName: "Joyal",
        lastName: "white",
        email:"joyalwhite@gamil.com",
        DOB:"21-03-1989",
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


// POST request: Create a new user

// req.query is used to access the query parameters in the request
// Example:curl --request POST 'localhost:5000/user?firstName=Jon&lastName=Lovato&email=jonlovato@theworld.com&DOB=10/10/1995'
router.post("/",(req,res)=>{
  
  try {
    const {firstName,lastName,email,DOB} = req.query;
    if(!firstName || !lastName || !email || !DOB){
      return res.status(400).send("All input is required");
    }
    
    users.push({firstName,lastName,email,DOB});
    res.send(`The user ${req.query.firstName} is added to the database`);
    console.log(users);
  } catch (error) {
    
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});


// PUT request: Update the details of a user by email ID
router.put("/:email", (req, res) => {
  // Copy the code here
  res.send("Yet to be implemented")//This line is to be replaced with actual return value
});


// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
  // Copy the code here
  res.send("Yet to be implemented")//This line is to be replaced with actual return value
});

module.exports=router;
