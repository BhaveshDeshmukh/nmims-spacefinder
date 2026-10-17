import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        className: {
            type: String,
            required: true,
            trim: true
        },

        dayOfWeek: {
            type: String,
            required: true,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ]
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        scheduleType: {
            type: String,
            enum: ["weekly", "specific-date"],
            default: "weekly"
        },

        date: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: ["scheduled", "cancelled"],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;