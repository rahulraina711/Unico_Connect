const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    full_name : {type: String , required: true},
    image_url : { type: String }
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);