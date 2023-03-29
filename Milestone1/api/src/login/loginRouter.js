const express = require('express');
const loginRouter = express.Router();

loginRouter.use(express.json())

let users = require('../data/users.json');

//login 
loginRouter.post('/', (req,  res) => {
    const userId = req.body.userId;
    const pass = req.body.pass;

    //Execute Spotify login code to check whether user exists in Spotify and pull information
    //TO BE added in the FUTURE

    if (false) { //example of invalid login
        res.json({success: "Response to be given when something went wrong with the login"});
    } else {
        res.json({success: "The spotify related backend logic for authentication and login has not been implemented yet. However when you login with your correct credentials you will recieve a sucess response as shown here.",
            userId: `${userId}`,
            pass: `${pass}`,
            status: `A new user with the userId: ${userId} would have been created in the completed application if the user did not already exist otherwise a refresh/update would have occured.`,
            note: "This is an EXAMPLE. REMEMBER none of the data being passed has been encrypted yet so please DO NOT USE YOUR REAL CREDENTIALS."});
    }
});
  
//Logout
loginRouter.delete('/', (req,  res) => {
    const userId = req.body.userId;
    const pass = req.body.pass;

    //Using spotify login verify that the current user requesting a delete is in fact the user who is being deleted by checking whether
    // the password is correct

    if (false) { //example of invalid login
        res.json({success: "Response to be given when something went wrong with the login"});
    } else {
        res.json({success: "The spotify related backend logic for the authentication process to logout a user has not been implemented yet. However when you pass your correct login details/credentials you will recieve a sucess response as shown here saying the user has been logged out.", 
            status: `User Session with userId:${userId} has been LOGGED OUT`,
            note: "This is an EXAMPLE. REMEMBER none of the data being passed has been encrypted yet so please DO NOT USE YOUR REAL CREDENTIALS."});
    }
});

module.exports = loginRouter;