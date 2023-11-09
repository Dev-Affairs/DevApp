const NodeCache = require('node-cache');
const tokenCache = new NodeCache(); // Used to store blacklisted tokens
const jwtConfig = require("../config/jwt.config.json")

// verify token
const verifyAccessToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'Access token is missing' });
    }
  
    // Check if the token is blacklisted
    if (tokenCache.get(token)) {
      return res.status(403).json({ error: 'Token has been revoked' });
    }
  
    jwt.verify(token, process.env.secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      req.user = user;
      next();
    });
  };

  // revoke token
  app.post('/revoke', (req, res) => {
    const tokenToRevoke = req.body.token;
  
    if (!tokenToRevoke) {
      return res.status(400).json({ error: 'Token to revoke is missing' });
    }
  
    // Add the token to the blacklist
    tokenCache.set(tokenToRevoke, true, jwtConfig.TOKEN_EXPIRATION);
  
    res.json({ message: 'Token revoked successfully' });
  });