import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

// Get all rooms
router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find({ isActive: true }).sort({ roomName: 1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rooms",
            error: error.message
        });
    }
});

// Get one room by ID
router.get("/:id", async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch room",
            error: error.message
        });
    }
});

// Add a new room
router.post("/", async (req, res) => {
    try {
        const room = await Room.create(req.body);

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: room
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create room",
            error: error.message
        });
    }
});

// Update a room
router.put("/:id", async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            data: room
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update room",
            error: error.message
        });
    }
});

export default router;