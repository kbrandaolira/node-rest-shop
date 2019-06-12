const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

router.post("/signup", (req,res,next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            // if exists, conflict error
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Mail exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        // save in database 
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                        .then(result=>{
                            console.log(result);
                            res.status(201).json({
                                message: "User created",
                                userCreated: user
                            })
                        }) 
                        .catch(err =>{
                            res.status(500).json({
                                error: err
                            })
                        });
                    }
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            })
        });
});

router.delete("/:userId", (req,res,next) => {
    Product.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.post("/login", (req,res,next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(404).json({
                    message: "Auth failed"
                });
            } 
            bcrypt.compare(req.body.password, user[0].password, (err,result) =>{
                if(err){
                    return res.status(404).json({
                        message: "Auth failed"
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id 
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )

                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    })
                }
                
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

module.exports = router;