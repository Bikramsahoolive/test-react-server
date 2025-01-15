const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../config/pgConfig');
const svgCaptcha = require('svg-captcha');



async function registerUser(req,res){
    const {name,email,password, userType, distCode} = req.body;
    try {
        const q = 'SELECT * FROM "UserData" WHERE email = $1';
        const value = [email];
        const result = await client.query(q,value);
        if(result.rows[0]){
            res.status(400).json({status:'failure',message:'User Already Exists.'});
            return;
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({status:'false',message:'Error while register user'});
        return;
    }
    
            try {

                const saltRounds = 10;
                const hash = bcrypt.hashSync(password, saltRounds);
                
                const q = `INSERT INTO public."UserData" (name,email,password,districtcode,usertype) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;
        const value = [name,email,hash,+distCode,userType];
        
        const result = await client.query(q,value);
        
        if(result.rows[0])res.status(200).json({status:'success',message:"User Registered."});
        
            } catch (error) {
                console.log(error);
                
                res.status(500).json({status:'false',message:'Error while register user2'});
            }
        }

async function loginUser(req,res){
    const {email,password,captcha,districtCode} = req.body;
    try {
        const q = 'SELECT * FROM "UserData" WHERE email = $1';
        const value = [email];
        const result = await client.query(q,value);
        const userData = result.rows[0];
        if(userData){
            const match = await bcrypt.compare(password, userData.password);

                    if(match){
                        delete userData.password
                        const token = jwt.sign(userData,'jwt-secKey');
                        res.status(200).json({status:'success',message:'Login Successful',authToken:token});
                    }else{
                        res.status(400).json({status:'failure',message:'Username or password incorrect.'});
                    }
                

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
            res.status(200).json({status:'success',message:'OTP Sent Successfully', email:userData.email});
        }else{
            res.status(400).json({status:'failure',message:'User Not Found.'});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error.'});
        
    }
}
async function verifyPassword(req,res){
    const {otp,email,password} = req.body;
    
    if(otp=='123456'){
        
        const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
        try {
            const q = `UPDATE "UserData" SET password = $1 WHERE email = $2 RETURNING *;`;
    const value = [hash,email];
    const result = await client.query(q,value);
    if(result.rows[0]){
        res.status(200).json({status:'success',message:"Password Updated Successfully."});
    }else{
        res.status(500).json({status:'false',message:'Error while update password'});
    }
    
        } catch (error) {
            console.log(error);
            res.status(500).json({status:'false',message:'Internal Server Error!'});
        }

    }else{
        res.status(400).json({status:"failure",message:"Invalid OTP."});
    }
}
function captchaData(req,res){
    const options = {
        size: 4,
        charPreset: '1234567890'
    };
    let captcha = svgCaptcha.create(options);
    // req.session.captcha = captcha.text;
    // res.status(200).send(captcha.data);
    res.status(200).json(captcha);
    
}

function checkAuth(req,res){
    try {
        
        const userData = jwt.verify(req.headers['auth'],'jwt-secKey');
        
        res.status(200).json({...userData,isAuthorized:true});
        
        
    } catch (error) {
        console.log(error);
        
        res.status(400).json({isAuthorized:false,message:"Token Expired, Login again."});
    }
}

module.exports = {registerUser,loginUser,forgotPassword,verifyPassword,captchaData,checkAuth}