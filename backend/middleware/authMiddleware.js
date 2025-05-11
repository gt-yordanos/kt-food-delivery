import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const tokenFromHeader = req.headers['authorization']?.split(' ')[1];

  const tokenFromCookie = req.cookies.authToken;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.id = user.id;
    req.role = user.role;

    next();
  });
};

// Middleware for role-based authorization (customer or admin)
export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
    }
    next();
  };
};