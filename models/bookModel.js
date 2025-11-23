import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A book must have a title"],
      trim: true,
      unique: true,
    },

    author: {
      type: String,
      required: [true, "A book must have an author"],
      trim: true,
    },

    writtenOn: {
      type: Date,
      required: [true, "A book must have a written date"],
    },

    pages: {
      type: Number,
      required: [true, "A book must have a page count"],
      min: [1, "A book must have at least 1 page"],
    },

    quantity: {
      type: Number,
      required: [true, "A book must have a quantity"],
      min: [0, "Quantity cannot be negative"],
    },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
