const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies ? req.cookies.token : null;
    
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ Message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.Jwtkkey);
    req.gymId = decoded.gymId;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ Message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
