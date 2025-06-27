// config.js
const { MongoClient, ServerApiVersion } = require("mongodb");

// Optional: use dotenv if you're keeping secrets in .env
require("dotenv").config();

// Use environment variable or hardcoded URI
const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://shreyash:qwertyuiop@users.rhpgqdd.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("users"); // Use your actual DB name
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1); // Exit if connection fails
  }
}

function getDB() {
  if (!db) {
    throw new Error("DB not connected. Call connectDB first.");
  }
  return db;
}

module.exports = { connectDB, getDB };
