const mongoose = require("mongoose");

let dbConnected = false;
let retries = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

const connectDB = async () => {
  try {
    // Try to connect to MongoDB Atlas with retry logic
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,  // Increased from 5000
      connectTimeoutMS: 20000,           // Increased from 10000
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    dbConnected = true;
    retries = 0;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    
    // Retry logic
    if (retries < MAX_RETRIES) {
      retries++;
      console.log(`⏳ Retrying connection (${retries}/${MAX_RETRIES}) in ${RETRY_DELAY / 1000}s...`);
      setTimeout(() => {
        connectDB();
      }, RETRY_DELAY);
    } else {
      console.log("⚠️  Max retries reached. Server running but database operations will fail.");
      console.log("⚠️  Check MongoDB Atlas:");
      console.log("   - Cluster status (running, not paused)");
      console.log("   - Network access whitelist (0.0.0.0/0 or your IP)");
      console.log("   - Database user credentials");
      console.log("   - Internet connection");
      dbConnected = false;
    }
  }
};

module.exports = { connectDB, dbConnected };