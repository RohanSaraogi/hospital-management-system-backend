import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";


// next parameter is a function used to pass control to next middleware
export const authenticate = async (req, res, next) => {

  // get token from header
  // expected token format : `Bearer and then actual token`
  const authToken = req.headers.authorization;


  // check if token exists or not
  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // extract token from {Bearer token}
    const token = authToken.split(" ")[1];
    
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;
    next(); // must be called next function otherwise wont work
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// we dont want anyone to access the users information
// higher order function
export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;
  let user;

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }
  next();
};
