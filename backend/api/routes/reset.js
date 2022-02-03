const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user_model')
const Password = require('../models/password_model');
const jwt = require('jsonwebtoken');

router.patch('/password', async (req, res, next) => {
    try {
        let { email , password } = req.body

        const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

        if(!passRegex.test(password)) return res.status(200).json({success: false ,message : `Password must contain an upper case letter, a lower case letter , a number , a special character and atleast contain 8 characters`});
        
        const encrypted_password = await bcrypt.hash(password, 10);

        // unique email
        const existingUser = await User.findOne({
            email
        });        
        // save password
        const pass = await Password.findOneAndUpdate({
            user_id : existingUser._id
        }, { old_password : encrypted_password , new_password : encrypted_password })

        return res.status(201).json({
            success: true,
        })


    } catch (err) {
        console.log("caught here: ", err)
        return res.status(500).json({message: err});
    }
});

module.exports = router ;