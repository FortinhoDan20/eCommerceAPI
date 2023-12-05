const mongoose = require("mongoose");
const crypto = require('crypto')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      default: "user"
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart:{
      type:Array,
      default: []
    },
    address: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    refreshToken: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },

  { timestamps: true }
);
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
