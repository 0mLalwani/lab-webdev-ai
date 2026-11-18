/* exp8 · Student model (Student Management System)
   Optimizations:
   - unique indexes on rollNo + email (also give instant 11000 -> 409 mapping)
   - compound index on (course, gpa) for the filter + sort used by the UI */
const { Schema } = require("mongoose");

const COURSES = ["CSE", "ECE", "ME", "CE"];

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name must be 80 characters or fewer"],
    },
    rollNo: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]{3,20}$/, "Roll number must be 3-20 letters/digits/dashes"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Email is invalid"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      enum: {
        values: COURSES,
        message: `Course must be one of: ${COURSES.join(", ")}`,
      },
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1, "Year must be between 1 and 5"],
      max: [5, "Year must be between 1 and 5"],
    },
    gpa: {
      type: Number,
      required: [true, "GPA is required"],
      min: [0, "GPA must be between 0 and 10"],
      max: [10, "GPA must be between 0 and 10"],
    },
  },
  { timestamps: true }
);

/* Compound index for the most common query: filter by course, sort by gpa. */
studentSchema.index({ course: 1, gpa: -1 });

/* A handful of demo students so the app is useful immediately. */
const SEED_STUDENTS = [
  { name: "Aisha Rahman", rollNo: "CSE-24-001", email: "aisha@ju.edu", course: "CSE", year: 2, gpa: 9.1 },
  { name: "Ben Carter", rollNo: "CSE-24-014", email: "ben@ju.edu", course: "CSE", year: 2, gpa: 8.4 },
  { name: "Chen Wei", rollNo: "ECE-23-007", email: "chen@ju.edu", course: "ECE", year: 3, gpa: 8.9 },
  { name: "Diya Patel", rollNo: "ECE-23-021", email: "diya@ju.edu", course: "ECE", year: 3, gpa: 7.6 },
  { name: "Ethan Brooks", rollNo: "ME-22-003", email: "ethan@ju.edu", course: "ME", year: 4, gpa: 7.2 },
  { name: "Fatima Noor", rollNo: "CE-25-010", email: "fatima@ju.edu", course: "CE", year: 1, gpa: 9.4 },
];

module.exports = { studentSchema, COURSES, SEED_STUDENTS };
