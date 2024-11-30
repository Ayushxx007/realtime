import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


    fullName:{
        type:String,
        required:true


    },
    emailId:{
        type:String,
        required:true,
        unique:true




    },
    password:{
        type:String,
        required:true,
        minLength:8

    },
    profilePic:{
        type:String,
        default:""


    }


},{timestamps:true});

export const User =mongoose.model("User",userSchema);

