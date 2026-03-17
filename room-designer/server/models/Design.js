const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  clientName: {
    type: String,
  },
  projectName: {
    type: String,
    required: true,
    default: "Untitled Design",
  },
  roomType: {
    type: String,
    enum: ["living-room", "bedroom", "kitchen", "dining-room", "office", "bathroom"],
    default: "living-room",
  },
  dimensions: {
    unit: {
      type: String,
      enum: ["m", "ft"],
      default: "m",
    },
    length: Number,
    width: Number,
    height: Number,
  },
  shape: {
    type: String,
    enum: ["rectangle", "l-shape", "custom"],
    default: "rectangle",
  },
  colors: {
    wall: String,
    floorMaterial: {
      type: String,
      enum: ["wood", "tile", "carpet"],
    },
    floorColor: String,
    ceilingColor: String,
  },
  lighting: {
    naturalLightDirection: {
      type: String,
      enum: ["east", "south", "west", "north"],
    },
    timeOfDay: Number,
    fixtures: [String],
  },
  items: [
    {
      id: String,
      name: String,
      category: String,
      price: Number,
      instanceId: String,
      position: [Number], // [x, y, z]
      rotation: [Number], // [x, y, z]
      scale: [Number], // [x, y, z]
    },
  ],
  status: {
    type: String,
    enum: ["draft", "completed"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving (synchronous - no callback needed)
DesignSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Design", DesignSchema);
