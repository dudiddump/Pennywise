import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("MONGODB_URI is not defined in environment variables");
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error("Invalid MongoDB URI format");
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  }

  try {
    const db = await mongoose.connect(uri);

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export default dbConnect;
