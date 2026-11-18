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
module.exports={registerUser};