
const Members = require('../Models/Members');
const membership_modal = require('../Models/membership');
const gym_modal = require('../Models/gym');
const bycrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');


require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { email, Gym_Name, Username, Password, Profilepic } = req.body;

        if (!email || !Gym_Name || !Username || !Password) {
            return res.status(400).json({ Message: "All required fields must be filled" });
        }

        const existingUser = await gym_modal.findOne({
            $or: [{ Username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ Message: "Username or Email already exists" });
        }
        else{

         const hashedPassword = await bycrypt.hash(Password, 10);
         console.log("Hashed Password:", hashedPassword); // Debugging log    


        const newGym = new gym_modal({
            email,
            Gym_Name,
            Username,
            Password: hashedPassword,
            Profilepic
        });

        await newGym.save();

        return res.status(201).json({ Message: "Gym registered successfully" , gym: newGym });
        }
        

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};


const cookieoptions={
    httpOnly:true,
    secure: false, // set to false for local HTTP development
    sameSite:'Lax',
}

// Login controller for gym
exports.login=async(req,res)=>{
    try{
        const{Username,Password}=req.body;
        const gym=await gym_modal.findOne({Username,});
        if(gym && await bycrypt.compare(Password, gym.Password)){

            const token = jwt.sign({ gymId: gym._id }, process.env.Jwtkkey, { expiresIn: '7d' });
            res.cookie('token', token, cookieoptions);
            console.log("Generated JWT Token:", token);  
            return res.status(200).json({Message:"Login successful" , success: true, gym, token});
        }
        else{
            return res.status(401).json({Message:"Invalid credentials"});
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error"});
    }
}

exports.getGymProfile = async (req, res) => {
    try {
        const gym = await gym_modal.findById(req.gymId).select('-Password');
        if (!gym) {
            return res.status(404).json({ Message: "Gym not found" });
        }
        return res.status(200).json({ success: true, gym });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ Message: "Logged out successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Sendersemail,
        pass: process.env.Senderpassword
    }
});

exports.sendotp=async(req,res)=>{
    try{
        const{email}=req.body; 
        const gym=await gym_modal.findOne({ email });
        if(gym){
            const buffer = crypto.randomBytes(4);
            const token =buffer.readUint32BE(0)%900000+100000; // Generate a 6-digit OTP
            gym.resetPasswordToken=token;
            gym.resetPasswordExpires=Date.now()+3600000; // OTP valid for 1 hour
            await gym.save();


            // Configure nodemailer transporter
            const mailoptions={
                from: process.env.EMAIL_USER,
                to: gym.email,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is: ${token}`
            }

            transporter.sendMail(mailoptions,(err,info)=>{
                if(err){
                    console.error("Error sending email:", err);
                }
                else{
                    console.log("Email sent:", info.response);
                }
            });


            console.log("Generated OTP:", token); // Debugging log
            // Generate OTP and send email logic here
            return res.status(200).json({Message:"OTP sent to email" , success: true, gym});
        }  
        else{
            return res.status(404).json({Message:"Gym not found"});
        }
    }

    catch(err){
            console.error(err);
            return res.status(500).json({message:"Server Error"});
    }
}


exports.verifyotp=async(req,res)=>{

    try{
        const{email,otp,newPassword}=req.body;
       const gym=await gym_modal.findOne({
        email,
        resetPasswordToken:otp,
        resetPasswordExpires: { $gt: Date.now() } // Check if OTP is still valid
       })
         if(!gym){
            return res.status(400).json({Message:"Invalid or expired OTP"});
         }
         res.status(200).json({Message:"OTP verified successfully" , success: true, gym});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error"});
    }
}


exports.resetpassword=async(req,res)=>{

    try{
        const{email,newPassword}=req.body;
       const gym=await gym_modal.findOne({
        email
        
       })
         if(!gym){
            return res.status(400).json({Message:"Invalid or expired OTP"});
         }
        

            const hashedPassword = await bycrypt.hash(newPassword, 10);
            gym.Password=hashedPassword;
            gym.resetPasswordToken=undefined;
            gym.resetPasswordExpires=undefined;
            await gym.save();
            res.status(200).json({Message:"Password reset successfully" , success: true, gym});
         
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error"});
    }
}