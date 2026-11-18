/* exp5 · Task model (Mongoose schema — registered on the exp5 connection) */
const { Schema } = require("mongoose");

const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title must be 120 characters or fewer"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Description must be 1000 characters or fewer"],
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: "Priority must be one of: low, medium, high",
      },
      default: "medium",
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = { taskSchema, PRIORITIES };
