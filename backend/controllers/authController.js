const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async(req,res)=>{

try{

const {name,email,password} = req.body;

const userExist = await User.findOne({email});

if(userExist){
    return res.status(400).json({
        success:false,
        message:"User already exists"
    });
}

const hashedPassword = await bcrypt.hash(password,10);

const user = await User.create({

    name,
    email,
    password:hashedPassword

});

res.status(201).json({

    success:true,
    message:"Registration successful"

});

}
catch(error){

res.status(500).json({

    success:false,
    message:error.message

});

}

};
exports.login = async(req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user){

return res.status(404).json({
success:false,
message:"User not found"
});

}

const isMatch = await bcrypt.compare(
password,
user.password
);

if(!isMatch){

return res.status(401).json({

success:false,
message:"Invalid credentials"

});

}
console.log(process.env.JWT_SECRET);
const token = jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

res.status(200).json({

success:true,
token,
user

});

}
catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

};
exports.getMe = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
                               .select("-password");

        res.status(200).json({
            success: true,
            user
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};