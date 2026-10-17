import mongoose from "mongoose";

const cancellationSchema = new mongoose.Schema(
    {
        timetableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Timetable",
            required: true
        },

        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        date: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/
        },

        startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/
        },

        endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/
        },

        reason: {
            type: String,
            trim: true,
            default: "Class cancelled"
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["cancelled", "reverted"],
            default: "cancelled"
        }
    },
    {
        timestamps: true
    }
);

const Cancellation = mongoose.model(
    "Cancellation",
    cancellationSchema
);

export default Cancellation;