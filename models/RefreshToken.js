import mongoose from "mongoose";

const RefreshTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      unique: true
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model("RefreshToken", RefreshTokenSchema);
