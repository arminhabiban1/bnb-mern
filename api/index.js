const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User= require('./models/User.js');
require('dotenv').config();
const app = express();



const bcryptSalt = bcrypt.genSaltSync(10)

app.use(express.json());
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'

}));
  mongoose.connect(process.env.MONGO_URL)

app.get('/test',(req,res)=>{
    res.json('test ok')})

    app.post('/register',async(req,res)=>{
        const {name,email,password}=req.body
        try{
       const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password,bcryptSalt)
        })
        res.json(userDoc)}
        catch(e){
                    
                    res.status(422).json(e)
                }
    
})

app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    
        const userFind = await User.findOne({email})
        if(userFind){
            res.json('userfind')
            const passOk= bcrypt.compareSync(password,userFind.password)
            if(passOk){
                res.cookie('token', '').json('passok')
            }
            else{
                res.status(422).json('passnotok')
            }
        }
        else{
            res.json('usernotfound')
          
          
          
          
          
          
   
   
   
   

        }})

app.listen(4000)