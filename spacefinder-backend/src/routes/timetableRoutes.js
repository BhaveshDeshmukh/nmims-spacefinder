import express from "express";
import Timetable from "../models/Timetable.js";
import Room from "../models/Room.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


// ==========================================
// GET ALL TIMETABLE RECORDS
// GET /api/timetable
// ==========================================

router.get("/", async (req, res) => {
    try {

        const timetable = await Timetable.find()
            .populate("roomId", "roomName type location")
            .sort({
                dayOfWeek: 1,
                startTime: 1
            });

        res.status(200).json({
            success: true,
            count: timetable.length,
            data: timetable
        });

    } catch (error) {

        console.log("Fetch timetable error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch timetable",
            error: error.message
        });

    }
});


// ==========================================
// POST NEW TIMETABLE RECORD
// POST /api/timetable
//
// Only authenticated admins can create
// timetable records.
// ==========================================

router.post("/", protect, adminOnly, async (req, res) => {
    try {

        const {
            roomId,
            subject,
            className,
            dayOfWeek,
            startTime,
            endTime,
            scheduleType,
            date
        } = req.body;


        // ------------------------------------------
        // CHECK BASIC REQUIRED FIELDS
        // ------------------------------------------

        if (
            !roomId ||
            !subject ||
            !className ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "roomId, subject, className, startTime and endTime are required"
            });
        }


        // ------------------------------------------
        // CHECK TIME FORMAT
        // ------------------------------------------

        if (
            !timePattern.test(startTime) ||
            !timePattern.test(endTime)
        ) {
            return res.status(400).json({
                success: false,
                message: "Time must be in HH:MM format"
            });
        }


        // ------------------------------------------
        // CHECK START TIME < END TIME
        // ------------------------------------------

        if (startTime >= endTime) {
            return res.status(400).json({
                success: false,
                message: "Start time must be before end time"
            });
        }


        // ------------------------------------------
        // CHECK SCHEDULE TYPE
        // ------------------------------------------

        const finalScheduleType = scheduleType || "weekly";

        if (!["weekly", "date"].includes(finalScheduleType)) {
            return res.status(400).json({
                success: false,
                message: "scheduleType must be either weekly or date"
            });
        }


        // ------------------------------------------
        // WEEKLY SCHEDULE VALIDATION
        // ------------------------------------------

        if (finalScheduleType === "weekly") {

            if (!dayOfWeek) {
                return res.status(400).json({
                    success: false,
                    message:
                        "dayOfWeek is required for weekly timetable"
                });
            }

            if (!validDays.includes(dayOfWeek)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid dayOfWeek"
                });
            }

        }


        // ------------------------------------------
        // DATE-SPECIFIC SCHEDULE VALIDATION
        // ------------------------------------------

        if (finalScheduleType === "date") {

            if (!date) {
                return res.status(400).json({
                    success: false,
                    message:
                        "date is required for date-specific timetable"
                });
            }

            const datePattern = /^\d{4}-\d{2}-\d{2}$/;

            if (!datePattern.test(date)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "date must be in YYYY-MM-DD format"
                });
            }

        }


        // ------------------------------------------
        // CHECK ROOM EXISTS
        // ------------------------------------------

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }


        // ------------------------------------------
        // CHECK OVERLAPPING TIMETABLE
        // ------------------------------------------

        let overlapQuery = {
            roomId: roomId,
            status: "scheduled",
            startTime: {
                $lt: endTime
            },
            endTime: {
                $gt: startTime
            }
        };


        if (finalScheduleType === "weekly") {

            overlapQuery.scheduleType = "weekly";
            overlapQuery.dayOfWeek = dayOfWeek;

        } else {

            overlapQuery.scheduleType = "date";
            overlapQuery.date = date;

        }


        const existing = await Timetable.findOne(
            overlapQuery
        );


        if (existing) {
            return res.status(409).json({
                success: false,
                message:
                    "Room already has a timetable entry during this time",

                conflict: {
                    timetableId: existing._id,
                    subject: existing.subject,
                    className: existing.className,
                    startTime: existing.startTime,
                    endTime: existing.endTime
                }
            });
        }


        // ------------------------------------------
        // CREATE TIMETABLE
        // ------------------------------------------

        const timetable = await Timetable.create({
            roomId: roomId,
            subject: subject,
            className: className,

            dayOfWeek:
                finalScheduleType === "weekly"
                    ? dayOfWeek
                    : null,

            startTime: startTime,
            endTime: endTime,

            scheduleType: finalScheduleType,

            date:
                finalScheduleType === "date"
                    ? date
                    : null,

            status: "scheduled"
        });


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(201).json({
            success: true,
            message:
                "Timetable record created successfully",
            data: timetable
        });


    } catch (error) {

        console.log(
            "Create timetable error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                "Failed to create timetable record",
            error: error.message
        });

    }
});


export default router;