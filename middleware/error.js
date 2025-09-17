// middleware/error.js
const errorHandler = (err, req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);

  if (err.name === "UnauthorizedError") {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }

  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
};

export default errorHandler;