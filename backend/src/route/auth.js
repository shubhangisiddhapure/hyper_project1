const express = require("express");
const User = require('../model/user.js')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const config=require("../config/config.json")
const validation=require("../validation/uservalidation.js")
const uservalidation = validation.userValidation
const {check,validationResult}=require("express-validator/check")
const router = express.Router()

//Admin or user singup
router.post('/singup', async(req,res)=>{
    let [result, data]=uservalidation(req.body)
    if(!result) return res.status(404).json({data})

    const {name,gender,email,phoneNo,password,isAdmin}=req.body;
    try{
           //see user exite
           let user = await User.findOne({email });
           if(user)
           {
               res.status(400).json({errors:[{msg:"user already exits"}]})
           }

            user = new User({
            name,
            gender,
            email,
            phoneNo,
            password,
            isAdmin
            });
            //encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password=await bcrypt.hash(password,salt)

            await user.save();

            //return jsonwebtoken
            const payload={
              user:{
                id:user.id
              }
            }
            jwt.sign(payload,
            config.jwtSecret,
            {expiresIn:360000},(err,token)=>{
                if(err)throw err;
                res.json({token});
            });


    }catch(error){
        console.log(error)
        res.status(500).send('EmailId has be unique')
    }

    
}),

//user or Admin login 
router.post('/login',[
    check('email','please enter a valid email').isEmail(),
    check('password','please enter valid password').exists()
    ],async(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors});
    }
    try{
        const {email,password}=req.body;
        //see user exite
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]})
        }
        
        const isMatch= await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]}) 
        }
        //return jsonwebtoken
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,
            config.jwtSecret,
            {expiresIn:360000},(err,token)=>{
                if(err)throw err;
                res.json({token});
            });
      
    }
    catch(err){
        console.log(err)
        res.status(500).send('server error')
    }


})


module.exports = router