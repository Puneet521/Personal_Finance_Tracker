const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // store decoded info for routes
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Restrict routes by roles
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
