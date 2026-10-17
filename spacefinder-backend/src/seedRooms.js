import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import Room from "./models/Room.js";

const rooms = [
  {
    roomName: "LR 1",
    type: "classroom",
    location: {
      wing: "B",
      floor: "Ground Floor",
      side: "Left Side"
    }
  },

  {
    roomName: "LR 3",
    type: "classroom",
    location: {
      wing: "B",
      floor: "Ground Floor",
      side: "Right Side"
    }
  },

  {
    roomName: "LR 10",
    type: "classroom",
    location: {
      wing: "B",
      floor: "2nd Floor",
      side: "Right Side"
    }
  },

  {
    roomName: "LR 17",
    type: "classroom",
    location: {
      wing: "C",
      floor: "1st Floor",
      side: "Right Side"
    }
  },

  {
    roomName: "LR 13",
    type: "classroom",
    location: {
      wing: "C",
      floor: "1st Floor",
      side: "Left Side"
    }
  },

  {
    roomName: "LR 22",
    type: "classroom",
    location: {
      wing: "D",
      floor: "Ground Floor",
      side: "Right Side"
    }
  },

  {
    roomName: "CN Lab",
    type: "laboratory",
    location: {
      wing: "B",
      floor: "2nd Floor",
      side: "Left Side"
    }
  },

  {
    roomName: "Programming Lab (PL)-1",
    type: "laboratory",
    location: {
      wing: "B",
      floor: "1st Floor",
      side: "Right Side"
    }
  },

  {
    roomName: "CC-1",
    type: "laboratory",
    location: {
      wing: "B",
      floor: "1st Floor",
      side: "Left Side"
    }
  }
];

const seedRooms = async () => {
  try {
    await connectDB();

    await Room.deleteMany({});

    await Room.insertMany(rooms);

    console.log("Rooms inserted successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error inserting rooms:", error.message);
    process.exit(1);
  }
};

seedRooms();