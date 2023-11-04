const {findOne, insertOne} = require("../services/mongoServices")
const collection = "user"
const bcrypt = require('bcrypt');

const register = async(req,res)=>{
  console.log("req.body --",req.body)
    const {username,email,password} = req.body
    try {
        const existingEmail = await findOne(collection,{email})
        if (existingEmail) {
            console.log("This E-mail is Already in use");
          return res.status(409).json({message : "This E-mail is Already in use"})
        }
        const extstingName = await findOne(collection,{username})
        if (extstingName) {
            console.log("User Name Already Taken");
           return res.status(409).json({message : "User Name Already Taken"})
        }
        const Password = bcrypt.hashSync(password,10)

         await insertOne(collection,{username,email,Password})
        console.log("Registration Sucessful");
        res.status(201).json({message:"Registration Sucessful"})
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
}

module.exports = {register}