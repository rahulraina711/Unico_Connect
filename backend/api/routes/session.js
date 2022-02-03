const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get("/", (req , res , next)=> {
    console.log(req.headers.authorization.split(" ")[1])
    const token = req.headers.authorization.split(" ")[1];
    console.log("session",token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded , Date.now())
    
    if (decoded.exp > Date.now()/1000) {
        res.status(200).json({success:true})
        
    }
    else{
        res.status(200).json({
            success: false ,
            message : "Session Expired. Please Log in again."
        })
    }
});

module.exports = router;