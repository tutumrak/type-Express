import  mongoose  from "mongoose";
import UserI from "./user.interface";
const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String
});

const userModel = mongoose.model<UserI & mongoose.Document>('User', userSchema);
export default userModel;