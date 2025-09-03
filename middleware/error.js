module.exports = (err, req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  if (err.name === 'UnauthorizedError') {
    console.error('Invalid token:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
  next(err);
};
