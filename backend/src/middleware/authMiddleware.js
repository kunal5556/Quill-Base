const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Not authorized, token is invalid or expired");
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw new ApiError(401, "Not authorized, this account no longer exists");
  }

  req.user = user;
  next();
});

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Only administrators can perform this action"));
  }

  next();
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.id);
    } catch {
      req.user = null;
    }
  }

  next();
});

module.exports = { protect, adminOnly, optionalAuth };
