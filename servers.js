const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
// . means look in the current folder
const users = require('./route/users');
const app =express();
// to take loging details the body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize())
// make the server
const port = process.env.PORT || 9000;
// to start the server
app.listen(port,()=> console.log(`Server running on port ${port}`));
// passport config
require('./config/passport')(passport);
module.exports = {
    mongoURI: 
         'mongodb://Omar Al:Amazingpoo1.mlab.com:47141/astrolabsapp2018'  
  };

  // // DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
.connect(db,{ useNewUrlParser: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.get('/', (req,res) => res.json({msg:"hello"}));
app.get('/about',(req, res) => res.send("Hello world"))
app.use('/users',users);

app.get('/dashboard',passport.authenticate('jwt',{session:false}),(req,res) => res.json({msg:"this is a private Dashboard"}));