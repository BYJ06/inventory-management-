const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const connection=require("../config/database.js");
const registerUser=async (req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"Please provide all required fields"});
    }
    bcrypt.hash(password,10,(err,hashedPassword)=>{
        if(err){
            return res.status(500).json({message:"Error hashing password"});
        }
        const sql="INSERT INTO users (name,email,password) VALUES (?,?,?)";
        connection.query(sql,[name,email,hashedPassword],(error,results)=>{
            if(error){
                return res.status(500).json({message:"Database error"});
            }
            res.status(201).json({message:"User registered successfully"});
        })
    })
}
const loginuser=(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please provide all required fields"});
    }
    const sql="SELECT * FROM users WHERE email=?";
    connection.query(sql,[email],(error,results)=>{
        if(error){
            return res.status(500).json({message:"Database error"});
        }
        if(results.length === 0){
            return res.status(404).json({message:"User not found"});
        }
        const user=results[0];
        bcrypt.compare(password,user.password,(err,isMatch)=>{
            if(err){
                return res.status(500).json({message:"Error comparing passwords"});
            }
            if(!isMatch){
                return res.status(401).json({message:"Invalid credentials"});
            }
            const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
            res.status(200).json({message:"Login successful",token});
        })
    })
}
module.exports={registerUser,loginuser};