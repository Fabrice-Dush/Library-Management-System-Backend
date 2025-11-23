import mongoose from "mongoose";

const rentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A rent record must belong to a student"],
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "A rent record must reference a book"],
    },

    status: {
      type: String,
      enum: ["approved", "unapproved", "returned", "overdue"],
      default: "unapproved",
    },

    borrowDate: {
      type: Date,
      required: [true, "Borrow date is required"],
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

//? query middleware
rentSchema.pre(/find/, function (next) {
  this.find()
    .populate({ path: "studentId", name: "student" })
    .populate({ path: "bookId", name: "book" });

  next();
});

const Rent = mongoose.model("Rent", rentSchema);
export default Rent;
