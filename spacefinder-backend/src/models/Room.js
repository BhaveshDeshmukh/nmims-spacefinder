import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: ["classroom", "laboratory"]
    },

    location: {
      wing: {
        type: String,
        required: true,
        enum: ["A", "B", "C", "D"]
      },

      floor: {
        type: String,
        required: true
      },

      side: {
        type: String,
        required: true,
        enum: ["Left Side", "Right Side"]
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;