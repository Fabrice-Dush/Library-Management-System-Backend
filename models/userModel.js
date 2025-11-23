import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please provide your firstName"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please provide your lastName"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please provide your email address"],
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minLength: [6, "A password must be at least 6 characters long"],
      required: [true, "Please provide your password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please provide your password confirmation"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and password confirmation must be the same",
      },
    },
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
    passwordChangedAt: Date,
    photo: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
    },
    role: {
      type: String,
      default: "student",
      enum: {
        values: ["student", "admin"],
        message: "role should either be student or admin",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPenalized: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//? Virtual properties
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//? document middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) return next();

  //? hashing password with salt of 12
  this.password = await bcrypt.hash(this.password, 10);

  //? deleting password confirmation field
  this.passwordConfirm = undefined;

  next();
});

//? instance methods
userSchema.methods.verifyPassword = async function (
  candidatePassword,
  userPassword
) {
  const isTrue = await bcrypt.compare(candidatePassword, userPassword);
  return isTrue;
};

userSchema.methods.checkPasswordChangedAfterTokenWasIssued = function (
  tokenIssuedAt
) {
  if (!this.passwordChangedAt) return true;

  const tokenIssued = tokenIssuedAt * 1000;

  const passwordChangedAt = this.passwordChangedAt.getTime();

  return tokenIssued > passwordChangedAt;
};

userSchema.methods.generatePasswordResetToken = function () {
  const passwordResetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(passwordResetToken)
    .digest("hex");

  this.passwordResetTokenExpiresIn = new Date(Date.now() + 10 * 60 * 1000);

  return passwordResetToken;
};

//? creating a user model
const User = mongoose.model("User", userSchema);

export default User;
