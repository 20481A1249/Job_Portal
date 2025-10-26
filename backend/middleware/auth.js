const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    token = req.query.token; // Check for token in query parameters
  }
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
