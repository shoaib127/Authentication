//jshint esversion:6
const express = require('express');

const app = express();

const mongoose = require('mongoose');

const encrypt = require('mongoose-encryption');

require("dotenv").config();

console.log(process.env.SECRET);

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine",'ejs');

const ejs = require('ejs');

app.listen(3000,function(){
  console.log("server of secrets has started");
})

app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register")
})

app.post("/register",function(req,res){
  const email=req.body.username;
  const password=req.body.password;
  const newuser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newuser.save(function(err){
    if (err) {
      console.log(err);
    }else {
      console.log("successfully registered");
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const email=req.body.email;
  const password=req.body.password;
  User.findOne({email:email},function(err,founduser){
    if (err) {
      console.log(err);
    }else {
      if (founduser) {
        if (founduser.password===password) {
          res.render("secrets");

        }
      }
    }
  })
})
