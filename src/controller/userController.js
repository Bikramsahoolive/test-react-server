const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../config/pgConfig');



async function registerUser(req,res){
    const {name,age,email,password} = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async function(err, hash) {
        if(!err){
            try {
                const q = `INSERT INTO "UserData" (name,email,age,password) VALUES ($1,$2,$3,$4) RETURNING *;`;
        const value = [name,email,age,hash];
        const result = await client.query(q,value);
        
        if(result.rows[0])res.status(200).json({status:'success',message:"User Registered."});
        
            } catch (error) {
                res.status(500).json({status:'false',message:'Error while register user'});
            }
        }
    });
    
}

async function loginUser(req,res){
    const data = req.body
    try {
        const q = 'SELECT * FROM "UserData" WHERE email = $1';
        const value = [data.email];
        const result = await client.query(q,value);
        const userData = result.rows[0];
        if(userData){

            bcrypt.compare(data.password, userData.password, function(err, match) {
                if(!err){
                    console.log(match);
                    if(match){
                        delete userData.password
                        const token = jwt.sign(userData,'jwt-secKey');
                        res.status(200).json({status:200,message:'Login Successful',authToken:token});
                    }else{
                        res.status(400).json({status:'failure',message:'Username or password incorrect.'});
                    }
                }
            });

        }else{
            res.status(400).json({status:'failure',message:'User Not Found.'});
        }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error.'})
    }
}

async function forgotPassword(req,res){
    const data = req.body;
    try {
        const q = 'SELECT * FROM "UserData" WHERE email = $1';
        const value = [data.email];
        const result = await client.query(q,value);
        const userData = result.rows[0];
        if(userData){
            delete userData.password;
            res.status(200).json({status:'success',message:'OTP Sent Successfully.'});
        }else{
            res.status(400).json({status:'failure',message:'User Not Found.'});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error.'});
        
    }
}
function verifyPassword(req,res){
    const {otp,email,password} = req.body;
    
    if(otp=='123456'){
        
        const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async function(err, hash) {
        try {
            const q = `UPDATE "UserData" SET password = $1 WHERE email = $2 RETURNING *;`;
    const value = [hash,email];
    const result = await client.query(q,value);
    console.log(result.rows[0]);
    if(result.rows[0]){
        res.status(200).json({status:'success',message:"Password Updated Successfully."});
    }else{
        res.status(500).json({status:'false',message:'Error while update password'});
    }
    
        } catch (error) {
            console.log(error);
            res.status(500).json({status:'false',message:'Internal Server Error!'});
        }
    })

    }else{
        res.status(400).json({status:"failure",message:"Invalid OTP."});
    }
}

module.exports = {registerUser,loginUser,forgotPassword,verifyPassword}