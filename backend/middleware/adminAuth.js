import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    // console.log("Auth Header:", req.headers.authorization);


    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Invalid admin credentials" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.log("adminAuth error:", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;
