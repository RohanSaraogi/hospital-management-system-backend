import User from "../models/UserSchema.js"
import Doctor from "../models/DoctorSchema.js"
import Booking from "../models/BookingSchema.js"
import Stripe from "stripe"

export const getCheckoutSession= async (req,res) => {
    const doctor = await Doctor.findById(req.params.doctorId)
    const user = await User.findById(req.userId)

    const stripe= new Stripe()
}