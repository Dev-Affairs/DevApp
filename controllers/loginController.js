const {findOne, insertOne} = require("../services/mongoServices")
const collection = "user"
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const jwtConfig = require("../config/jwt.config.json")

const login = async(req,res)=>{
    try {
     const { username, password } = req.body;
     console.log(req.body);
     const user = await findOne(collection,{username})
     if (!user) {
      return res.status(401).json({ error: 'Invalid User' });
     }
     const isValidPassword = await bcrypt.compare(password, user.Password);
     if (!isValidPassword) {
      return res.status(401).json({ error: 'Inavlid Credentials' });
    }
  const accessToken = jwt.sign({  username: user.username, role: user.role },jwtConfig.secretKey , { expiresIn: jwtConfig.TOKEN_EXPIRATION });
  const refreshToken = jwt.sign({  username: user.username, role: user.role }, jwtConfig.secretKey, { expiresIn:jwtConfig.REFRESH_TOKEN_EXPIRATION });

    res.status(201).json({message:"Sucessfully LoggedIn",accessToken,refreshToken})
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  module.exports = {login}