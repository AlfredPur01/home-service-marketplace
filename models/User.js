import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
 },
  profileImage: {
      type: String,
  },
  bookings: {
    type: Array,
    default: [],
  },
  appointments: {
    type: Array,
    default: [],
  },
  services: {
    type: Array,
    default: [],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
