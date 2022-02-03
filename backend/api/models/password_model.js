const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    old_password: {type: String, required: true},
    new_password: {type: String, required: true},
    user_id : { type : mongoose.Schema.Types.ObjectId , ref : "User" }
},
{ timestamps: true });

module.exports = mongoose.model("Password", passwordSchema);