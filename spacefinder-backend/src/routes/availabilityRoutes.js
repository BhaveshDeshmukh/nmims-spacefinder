import express from "express";
import Room from "../models/Room.js";
import Timetable from "../models/Timetable.js";
import Cancellation from "../models/Cancellation.js";

const router = express.Router();

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;


// -----------------------------------------
// CHECK WHETHER DATE IS A REAL CALENDAR DATE
// -----------------------------------------

const isValidDate = (date) => {

    if (!datePattern.test(date)) {
        return false;
    }

    const [year, month, day] = date.split("-").map(Number);

    const testDate = new Date(
        Date.UTC(year, month - 1, day)
    );

    return (
        testDate.getUTCFullYear() === year &&
        testDate.getUTCMonth() === month - 1 &&
        testDate.getUTCDate() === day
    );
};


// -----------------------------------------
// GET ROOM AVAILABILITY
//
// Example:
// GET /api/availability?date=2026-10-20&time=14:30
// -----------------------------------------

router.get("/", async (req, res) => {

    try {

        const { date, time } = req.query;


        // -----------------------------------------
        // VALIDATE DATE
        // -----------------------------------------

        if (!date) {

            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }


        if (!isValidDate(date)) {

            return res.status(400).json({
                success: false,
                message: "Date must be a valid date in YYYY-MM-DD format"
            });
        }


        // -----------------------------------------
        // VALIDATE TIME
        // -----------------------------------------

        if (!time) {

            return res.status(400).json({
                success: false,
                message: "Time is required"
            });
        }


        if (!timePattern.test(time)) {

            return res.status(400).json({
                success: false,
                message: "Time must be in HH:MM format"
            });
        }


        // -----------------------------------------
        // FIND DAY OF WEEK
        // -----------------------------------------

        const selectedDate = new Date(`${date}T00:00:00Z`);

        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const dayOfWeek = days[selectedDate.getUTCDay()];


        // -----------------------------------------
        // GET ACTIVE ROOMS
        // -----------------------------------------

        const rooms = await Room.find({
            isActive: true
        }).sort({
            roomName: 1
        });


        // -----------------------------------------
        // GET TIMETABLE RECORDS
        // -----------------------------------------

        const timetable = await Timetable.find({

            $or: [

                // Weekly timetable
                {
                    scheduleType: "weekly",
                    dayOfWeek: dayOfWeek,
                    status: "scheduled"
                },

                // Specific date timetable
                {
                    date: date,
                    status: "scheduled"
                }
            ]

        }).populate(
            "roomId",
            "roomName type location"
        );


        // -----------------------------------------
        // GET CANCELLATIONS FOR SELECTED DATE
        // -----------------------------------------

        const cancellations = await Cancellation.find({

            date: date,
            status: "cancelled"

        });


        // -----------------------------------------
        // CALCULATE AVAILABILITY
        // -----------------------------------------

        const result = rooms.map((room) => {


            // -----------------------------------------
            // FIND ALL TIMETABLES FOR THIS ROOM
            // -----------------------------------------

            const roomSchedules = timetable.filter(
                (item) => {

                    return (
                        item.roomId &&
                        item.roomId._id.toString() ===
                        room._id.toString()
                    );
                }
            );


            // -----------------------------------------
            // FIND ALL CLASSES COVERING SELECTED TIME
            // -----------------------------------------

            const schedulesAtTime = roomSchedules.filter(
                (schedule) => {

                    return (
                        time >= schedule.startTime &&
                        time < schedule.endTime
                    );
                }
            );


            // -----------------------------------------
            // FIND ACTIVE CLASS
            //
            // A timetable is active only when:
            // 1. It covers the selected time
            // 2. It is NOT cancelled for this date
            // -----------------------------------------

            const activeSchedule = schedulesAtTime.find(
                (schedule) => {

                    const cancellation = cancellations.find(
                        (item) => {

                            return (
                                item.timetableId &&
                                item.roomId &&

                                item.timetableId.toString() ===
                                schedule._id.toString() &&

                                item.roomId.toString() ===
                                room._id.toString() &&

                                time >= item.startTime &&
                                time < item.endTime
                            );
                        }
                    );


                    // No cancellation means class is active
                    return !cancellation;
                }
            );


            // -----------------------------------------
            // ACTIVE CLASS FOUND
            // -----------------------------------------

            if (activeSchedule) {

                return {

                    roomId: room._id,

                    roomName: room.roomName,

                    type: room.type,

                    location: room.location,

                    status: "occupied",

                    schedule: {

                        subject: activeSchedule.subject,

                        className: activeSchedule.className,

                        startTime: activeSchedule.startTime,

                        endTime: activeSchedule.endTime
                    }
                };
            }


            // -----------------------------------------
            // CHECK WHETHER CLASSES WERE CANCELLED
            // -----------------------------------------

            const cancelledSchedule = schedulesAtTime.find(
                (schedule) => {

                    return cancellations.some(
                        (item) => {

                            return (
                                item.timetableId &&
                                item.roomId &&

                                item.timetableId.toString() ===
                                schedule._id.toString() &&

                                item.roomId.toString() ===
                                room._id.toString() &&

                                time >= item.startTime &&
                                time < item.endTime
                            );
                        }
                    );
                }
            );


            // -----------------------------------------
            // CLASS CANCELLED
            // -----------------------------------------

            if (cancelledSchedule) {

                const cancellation = cancellations.find(
                    (item) => {

                        return (
                            item.timetableId &&
                            item.roomId &&

                            item.timetableId.toString() ===
                            cancelledSchedule._id.toString() &&

                            item.roomId.toString() ===
                            room._id.toString() &&

                            time >= item.startTime &&
                            time < item.endTime
                        );
                    }
                );


                return {

                    roomId: room._id,

                    roomName: room.roomName,

                    type: room.type,

                    location: room.location,

                    status: "available",

                    schedule: null,

                    cancellation: {

                        cancelled: true,

                        reason:
                            cancellation?.reason ||
                            "Class cancelled"
                    }
                };
            }


            // -----------------------------------------
            // NO CLASS
            // -----------------------------------------

            return {

                roomId: room._id,

                roomName: room.roomName,

                type: room.type,

                location: room.location,

                status: "available",

                schedule: null
            };

        });


        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        return res.status(200).json({

            success: true,

            date: date,

            dayOfWeek: dayOfWeek,

            time: time,

            count: result.length,

            data: result
        });


    } catch (error) {

        console.log(
            "Availability error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to check room availability",

            error: error.message
        });
    }
});


export default router;