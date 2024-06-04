import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoute from "./Routes/auth.js"
import userRoute from "./Routes/user.js"
import doctorRoute from "./Routes/doctor.js"
import reviewRoute from "./Routes/review.js"
dotenv.config();

const app = express();
const port= process.env.PORT || 8000;

const corsOptions = {
    origin: true 
    // allows any domain to access the server, only using the development we use true otherwise we will restrict the access
};

app.get('/',(req,res)=>{
    res.send('Api is working')
});

// database connection
mongoose.set('strictQuery',false); // otherwise it will warn the console

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected")
    } catch (err) {
        console.log("MongoDB connection failed" + err)
    }
}

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth",authRoute); // telling to use auth route
app.use("/api/v1/users",userRoute); // telling to use user route
app.use("/api/v1/doctors",doctorRoute); // telling to use doctor route
app.use("/api/v1/reviews",reviewRoute); // telling to use review route


app.listen(port, ()=>{
    connectDB();
    console.log('Backend server is running on port ' + port)
});