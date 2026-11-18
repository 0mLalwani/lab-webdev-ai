/* exp7 · Product model */
const { Schema } = require("mongoose");

const CATEGORIES = ["electronics", "apparel", "books", "home"];

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name must be 120 characters or fewer"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Description too long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* A few seeded products so Postman/demos have data on a fresh server. */
const SEED_PRODUCTS = [
  { name: "Aurora Wireless Headphones", category: "electronics", price: 129.99, quantity: 42, description: "Over-ear ANC headphones, 30h battery." },
  { name: "Tidepool Desk Lamp", category: "home", price: 44.5, quantity: 17, description: "Warm-tone LED lamp with USB-C charging." },
  { name: "Deep Dive: Node.js Handbook", category: "books", price: 29.0, quantity: 80, description: "320-page guide to backend Node.js." },
  { name: "Harbourline Windbreaker", category: "apparel", price: 74.0, quantity: 0, inStock: false, description: "Water-resistant jacket, currently sold out." },
  { name: "Nebula Smart Mug", category: "home", price: 59.95, quantity: 25, description: "Temperature-controlled ceramic mug." },
];

module.exports = { productSchema, CATEGORIES, SEED_PRODUCTS };
