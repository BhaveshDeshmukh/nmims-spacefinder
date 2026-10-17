import express from "express";

import Cancellation from "../models/Cancellation.js";
import Timetable from "../models/Timetable.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE CANCELLATION
// POST /api/cancellations
// ==========================================

router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                timetableId,
                date,
                reason
            } = req.body;


            // Check required fields
            if (!timetableId || !date) {
                return res.status(400).json({
                    success: false,
                    message: "timetableId and date are required"
                });
            }


            // Check date format
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;

            if (!datePattern.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: "Date must be in YYYY-MM-DD format"
                });
            }


            // Find original timetable
            const timetable = await Timetable.findById(timetableId);

            if (!timetable) {
                return res.status(404).json({
                    success: false,
                    message: "Timetable record not found"
                });
            }


            // Check whether already cancelled
            const existingCancellation = await Cancellation.findOne({
                timetableId: timetableId,
                date: date,
                status: "cancelled"
            });

            if (existingCancellation) {
                return res.status(409).json({
                    success: false,
                    message: "This timetable occurrence is already cancelled"
                });
            }


            // Create cancellation
            const cancellation = await Cancellation.create({
                timetableId: timetable._id,

                roomId: timetable.roomId,

                date: date,

                startTime: timetable.startTime,

                endTime: timetable.endTime,

                reason: reason || "Class cancelled",

                // Take logged-in admin from JWT
                cancelledBy: req.user._id
            });


            // Populate useful information
            await cancellation.populate([
                {
                    path: "roomId",
                    select: "roomName type location"
                },
                {
                    path: "timetableId"
                },
                {
                    path: "cancelledBy",
                    select: "name email role"
                }
            ]);


            res.status(201).json({
                success: true,
                message: "Class cancelled successfully",
                data: cancellation
            });


        } catch (error) {

            console.log("Cancellation error:", error);

            res.status(500).json({
                success: false,
                message: "Failed to cancel timetable",
                error: error.message
            });

        }

    }
);


// ==========================================
// GET ALL CANCELLATIONS
// GET /api/cancellations
// ==========================================

router.get(
    "/",
    async (req, res) => {

        try {

            const cancellations = await Cancellation.find()
                .populate(
                    "roomId",
                    "roomName type location"
                )
                .populate(
                    "timetableId"
                )
                .populate(
                    "cancelledBy",
                    "name email role"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json({
                success: true,
                count: cancellations.length,
                data: cancellations
            });


        } catch (error) {

            console.log(
                "Get cancellations error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to fetch cancellations",
                error: error.message
            });

        }

    }
);


// ==========================================
// REVERT CANCELLATION
// PATCH /api/cancellations/:id/revert
// ==========================================

router.patch(
    "/:id/revert",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const cancellation =
                await Cancellation.findById(
                    req.params.id
                );


            if (!cancellation) {
                return res.status(404).json({
                    success: false,
                    message: "Cancellation not found"
                });
            }


            // Check whether already reverted
            if (cancellation.status === "reverted") {
                return res.status(409).json({
                    success: false,
                    message: "Cancellation is already reverted"
                });
            }


            // Revert cancellation
            cancellation.status = "reverted";

            await cancellation.save();


            await cancellation.populate([
                {
                    path: "roomId",
                    select: "roomName type location"
                },
                {
                    path: "timetableId"
                },
                {
                    path: "cancelledBy",
                    select: "name email role"
                }
            ]);


            res.status(200).json({
                success: true,
                message: "Cancellation reverted successfully",
                data: cancellation
            });


        } catch (error) {

            console.log(
                "Revert cancellation error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to revert cancellation",
                error: error.message
            });

        }

    }
);


export default router;