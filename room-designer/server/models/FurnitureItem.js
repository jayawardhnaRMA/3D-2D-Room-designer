const mongoose = require("mongoose");

const furnitureItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide furniture name"],
    },
    category: {
      type: String,
      enum: ["Sofas", "Tables", "Chairs", "Beds", "Storage", "Lighting", "Decorative"],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    dimensions: {
      width: { type: Number, default: 0 },
      depth: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      unit: { type: String, default: "cm" },
    },
    materials: [String],
    colors: [String],
    style: {
      type: String,
      enum: ["Modern", "Scandinavian", "Industrial", "Minimalist", "Traditional"],
      default: "Modern",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      enum: ["NEW", "POPULAR", "SALE", null],
      default: null,
    },
    modelPath: {
      type: String,
      default: "",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isFromEditor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FurnitureItem", furnitureItemSchema);
