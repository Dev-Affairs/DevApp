const jwtConfig = require("../config/jwt.config.json") 
 
 const refresh = async(req, res) => {
   try {
    const refreshToken = req.body.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is missing' });
    }
  
    jwt.verify(refreshToken, jwtConfig.secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }
  
      const accessToken = jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn: jwtConfig.TOKEN_EXPIRATION });
  
      res.status(201).json({ accessToken });
    });
   } catch (error) {
    res.status(500).json({error:"Internal Server Error ...!"})
   }
  }

  module.exports = {refresh}