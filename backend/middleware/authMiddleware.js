import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Look for the token in the Authorization header (Bearer <token>)
  const tokenFromHeader = req.headers['authorization']?.split(' ')[1];

  // If token is not found in the Authorization header, check the cookies
  const tokenFromCookie = req.cookies.authToken;

  const token = tokenFromHeader || tokenFromCookie; // Prioritize token from header, fallback to cookie

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to the request object for use in other routes
    req.id = user.id;  // Using `id` instead of `customerId`
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