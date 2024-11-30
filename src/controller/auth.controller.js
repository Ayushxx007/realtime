import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import {generateToken} from "../lib/utils.lib.js";
import cloudinary from "../lib/cloudinary.js";;

export const signup=async(req,res)=>{

    const {fullName,emailId,password}=req.body;

    try{
        if(!emailId || !password || !fullName){
            return res.status(400).json({message:"all fields are required"});


        }


        if(password.length<8){
            return res.status(400).json({message:"Password should be at least 8 characters long"});

        }

        const user =await User.findOne({emailId});

        if(user){
            return res.status(400).json({message:"EmailId already exists"});

        }

        const salt =await bcrypt.genSalt(10);

        const hashedPassword =await bcrypt.hash(password,salt);


        const newUser =new User({fullName,emailId,password:hashedPassword});

        if(newUser){

            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).send("user saved successfully");






        }else{

            throw new Error("Failed to create new user");


        }



    }catch(err){

        res.status(500).send("Internal server error");



    }


  

}
export const login=async(req,res)=>{

    try{

        const {emailId,password}=req.body;
    
        if(!emailId || !password){
            return res.status(400).json({message:"Please enter both emailId and password"});
    
        }

        const user= await User.findOne({emailId});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});

        }

        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            message:"User logged in successfully",
        });
    
    


    }catch(err){

        res.status(500).send("Internal server error");



    }

   


  

}

export const logout=(req,res)=>{

try{
    res.cookie("jwt","",{maxAge:0});

    res.status(200).send("logged out successfully");




    }catch(err){

        res.status(500).send("Internal server error");
    }
   
    

}

export const updateProfile=async(req,res)=>{

 try{

    const {profilePic}=req.body;
    const userId=req.user._id;
    if(!profilePic){
        return res.status(400).json({message:"Please provide a profile picture"});
    }

    const uploadResponse=await cloudinary.uploader.upload(profilePic);
    const updatedUser=User.findByIdAndUpdate({profilePic:uploadResponse.secure_url},{new:true});

    res.status(200).json(updatedUser);

    }catch(err){

        res.status(500).send("Internal server error");

    }

    




};

export const checkAuth=async(req,res)=>{

    try{

        res.status(200).json(req.user);


    }catch(err){

        res.status(500).send("Internal server error");



    }




}