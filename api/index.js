const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User= require('./models/User.js');
require('dotenv').config();
const app = express();



const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'dlshkdskljdslkdfsffdfddfsjds'

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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await User.findOne({ email });

        if (!userDoc) {
            // Email not found
            return res.status(422).json('usernotfound');
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json('passok');
            });
        } else {
            // Password not correct
            res.status(422).json('passnotok');
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json('servererror');
    }
});

app.listen(4000)