import validator from "validator"
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"





const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}



// Route for user login

async function loginUser(req, res) {

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User does not exists" })

    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id)
      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, message: "invalid credentials" })
    }
  }


  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })

  }
}
// Route for user register

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already register or not

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already register" })
    }
    // validat email and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" })
    }

    // hashing password

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashPassword
    })

    const user = await newUser.save()

    const token = createToken(user._id)
    res.json({ success: true, token })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })


  }

}

// Route for admin login
 

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Try to find or create the admin user
      let adminUser = await userModel.findOne({ email });
      
      if (!adminUser) {
        adminUser = await userModel.create({
          email,
          name: "Admin",
          cartData: {},
        });
        console.log("✅ Admin user auto-created.");
      }

      const token = jwt.sign({ id: adminUser._id, email }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.log("adminLogin error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};








export { loginUser, registerUser, adminLogin };
