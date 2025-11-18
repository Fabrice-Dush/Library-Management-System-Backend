import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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
      trim: true,
      lowercase: true,
      required: [true, "Please provide your password"],
    },
    passwordConfirm: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please provide your password confirmation"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and password confirmation must be the same",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin"],
        message: "role should either be user or admin",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: { type: Date, default: Date.now },
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
// userSchema.pre("save", async function (next) {
//   //? hashing password with salt of 12
//   this.password = await bcrypt.hash(this.password, 10);

//   //? deleting password confirmation field
//   this.passwordConfirm = undefined;

//   next();
// });

//? instance methods
userSchema.methods.verifyPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log({ candidatePassword, userPassword });
  const isTrue = await bcrypt.compare(candidatePassword, userPassword);
  console.log(await bcrypt.compare(candidatePassword, userPassword));
  console.log(isTrue);
  return isTrue;
};

//? creating a user model
const User = mongoose.model("User", userSchema);

export default User;
