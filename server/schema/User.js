import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Optional display name
    name: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["finance_manager", "admin"],
      default: "finance_manager",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique index on email for quick lookups and uniqueness
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;
