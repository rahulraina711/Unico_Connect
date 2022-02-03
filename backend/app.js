const express =require('express');
const app = express();
// console module
const morgan = require('morgan');
// req body parser
const bodyParser = require('body-parser');
// db
const mongoose = require('mongoose');
// for local server
const dotenv = require("dotenv");
//const cookieParser = require('cookie-parser');
const cors = require("cors");

dotenv.config();

// connecting to mongoDB
mongoose.connect(process.env.MDB_CONNECT_STRING, {
    useNewUrlParser:true,
    useUnifiedTopology: true
},(err)=>{
    if (err) {
        return console.error(err);
    }
    console.log("----Got the API key and the Secret key----\n:::::Connected to MongoDB:::::");
});
mongoose.set('useFindAndModify', false);

app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:true ,parameterLimit:1000000, limit:"500mb"}));
app.use(bodyParser.json({limit:"50mb"}));

// adding static folder publically accesible
app.use('/uploads',express.static('uploads'));
// handling cors errors
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, POST,DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

// localhost:PORT response
app.get("/",(req, res, next)=>{
    res.status(200).json({message:"Everything is working fine here"})
})

// routes

const userRoute = require('./api/routes/user');
app.use('/user', userRoute);

const imageRoute = require('./api/routes/image');
app.use('/image', imageRoute);

const session = require("./api/routes/session");
app.use("/checkSession", session);

const reset = require("./api/routes/reset");
app.use("/reset", reset);



module.exports = app