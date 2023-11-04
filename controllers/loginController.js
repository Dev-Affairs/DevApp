const {findOne, insertOne} = require("../services/mongoServices")
const collection = "user"
const bcrypt = require('bcrypt');

const login = async(req,res)=>{
    try {
     const { username, password } = req.body;
     const user = await findOne(collection,{username})
     if (!user) {
      return res.status(401).json({ error: 'Invalid User' });
     }
  
     const isValidPassword = await bcrypt.compare(password, user.password);
  
     if (!isValidPassword) {
      return res.status(401).json({ error: 'Inavlid Credentials' });
    }
  
    res.status(201).json({message:"Sucessfully LoggedIn"})
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  module.exports = {login}