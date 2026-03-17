const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const designRoutes = require("./routes/designs");
const clientRoutes = require("./routes/clientRoutes");
const furnitureRoutes = require("./routes/furnitureRoutes");

dotenv.config();

connectDB();

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Auth routes
app.use("/api/auth", authRoutes);

// Design routes
app.use("/api/designs", designRoutes);

// Client routes
app.use("/api/clients", clientRoutes);

// Furniture routes
app.use("/api/furniture", furnitureRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Roomio API running",
    mongoConnected: global.useMockDB ? "mock-db" : "mongodb-atlas",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongoUri: process.env.MONGO_URI ? "configured" : "not-configured",
    database: global.useMockDB ? "mock-in-memory" : "mongodb-atlas",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});