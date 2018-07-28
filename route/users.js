const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const keys = require('../config/keys');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// .. to go back a folder
const User = require('../models/User');
//takes what is submitted from wherever the user is submittin it.
const bodyParser = require('body-parser');
router.get('/test',(req,res)=>res.json({msg:"Users Works"}));

router.post('/register', (req, res)=> {
    // it will return it in a then function
    User.findOne({email:req.body.email})
    .then(users=>{
        if(users)
        {
            return res.status(400).json({email:"Email Already Exists"})
        } else{
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
              });
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                avatar:avatar //  dont need to put equal because javascript because somethinng is equal to itself
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(users => res.json(users))
                    .catch(err => console.log(err));
                });
              });
    
        }

    })



});

router.post('/login',(req, res)=>{
    const email=req.body.email
    const password= req.body.password
    // finds the user email
    User.findOne({email}).then(users => {
        // checks for the user
        if(!users)
        {
            return res.status(400).json({email:"User account does not exist"});
        }
        else{
            bcrypt.compare(password,users.password).then(isMatch => {
                if(isMatch)
                {  // user matched
                    const payload = {id:users.id, name:users.name}
                    //sign token
                    jwt.sign(
                        payload,
                        keys.secret,
                        { expiresIn: 3600 },
                        (err, token) => {
                          res.json({
                            success: true,
                            token: 'Bearer ' + token
                          });
                        }
                      );
                    
                    

                    }
                else
                {
                    // tell them sorry
                }
            })
        }
    })

})
// for the file to connect to the rest of the application you have to export it
module.exports = router;