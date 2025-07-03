import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAdminToken = () => {
  const payload = {
    email: process.env.ADMIN_EMAIL,
    role: "admin", // ✅ Add role here
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    // expiresIn: "10d/ Token expires in 1 day"
  });

  console.log("Admin token:", token);
};

generateAdminToken();
