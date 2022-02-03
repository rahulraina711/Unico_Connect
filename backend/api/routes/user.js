const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user_model')
const Password = require('../models/password_model');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");

router.get("/",(req, res, next)=>{
    let { email } = req.query;
    console.log("user: ",email)
    User.findOne({email} ).exec()
    .then(docs=>{
        res.status(201).json(docs)
    })
    .catch(err=>{res.status(404).json({message: err})})
    
});

router.post('/signUp', async (req, res, next) => {
    try {
        let { full_name , email , password } = req.body

        console.log(full_name , email , password)

        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

        if(!emailRegexp.test(email)) return res.status(200).json({success: false ,message : `${email} is not a valid email.`});
        if(!passRegex.test(password)) return res.status(200).json({success: false ,message : `Password must contain an upper case letter, a lower case letter , a number , a special character and atleast contain 8 characters`});
        
        const encrypted_password = await bcrypt.hash(password, 10);

        // unique email
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "Email already exists. Please Log In."
            })
        }
        const user = new User({
            email,
            full_name,
        })
        const savedUser = await user.save();
        
        // save password
        const pass = new Password({
            old_password : encrypted_password,
            new_password : encrypted_password,
            user_id : savedUser._id
        })

        const saved_pass = await pass.save();

        //create a jwt token
        const token = jwt.sign({
            userId: savedUser._id
        }, process.env.JWT_KEY , {
            expiresIn : '2h'
        });

        return res.status(201).json({
            success: true,
            userId : savedUser._id,
            token
        })


    } catch (err) {
        console.log("caught here: ", err)
        return res.status(500).json({message: err});
    }
});

router.post('/login', async (req, res, next) => {
    try {
    
        let { email , password } = req.body
        console.log(email , password);
        // unique email
        const existingUser = await User.findOne({
            email
        });
        console.log("User: ",existingUser);

        if (existingUser) {
            //res.status(201).json(existingUser);
            let pass_details = await Password.findOne({user_id : existingUser._id})
            // console.log(pass_details)
            bcrypt.compare(password, pass_details.new_password ,(err, result)=>{
                if(!result){
                    console.log(err)
                    return res.status(200).json({success:false,message: "auth failed" , err})
                }
                if(result){
                    const token = jwt.sign({
                        userId: existingUser._id
                    }, process.env.JWT_KEY,{
                        expiresIn: "2h"
                    })
                    return res.status(201).json({success:true , userId:existingUser._id,message: "auth done", token: token})
                }
            })// a slight issue with wrong password, the server times out (yet to be fixed)
        }
        else{
            return res.status(200).json({success:false , message: "User not found. Please Sign Up."})
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Somwthing went wrong. Please try again later.",err});
    }
});

router.patch("/:id" , auth , async (req, res, next)=>{
    let { id } = req.params;
    console.log("Incoming: ",id);
    console.log(req.body);
    let update_req = await User.findOneAndUpdate({_id : id}, req.body);
    console.log(update_req); 
    res.status(200).json({update_req}) 
})

router.get("/:id",(req, res, next)=>{
    let user_id = req.params.id;
    console.log("user_id: ",user_id)
    User.findById(user_id , 'full_name email image_url').exec()
    .then(docs=>{
        res.status(201).json(docs)
    })
    .catch(err=>{res.status(404).json({message: err})})
    
});




module.exports = router;