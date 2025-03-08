import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      console.log('✅ Decoded Token:', decoded);
      
      if (!decoded.admin_id || !decoded.role) {
        return res.status(403).json({ error: 'Invalid token: Missing admin_id or role' });
      }

      // Attach user info to req
      req.user = {
        admin_id: decoded.admin_id,
        role: decoded.role,
      };

      console.log('✅ Authenticated Admin ID:', req.user.admin_id);
      next();
    });
  } catch (err) {
    console.error('❌ JWT Middleware Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Role-based Authorization Middleware
export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};
