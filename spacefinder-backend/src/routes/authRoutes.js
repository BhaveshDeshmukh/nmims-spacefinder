import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();


// ==========================================
// CREATE JWT TOKEN
// ==========================================

const generateToken = (userId) => {
    return jwt.sign(
        {
            userId: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};


// ==========================================
// REGISTER STUDENT
// POST /api/auth/register
// ==========================================

router.post("/register", async (req, res) => {
    try {

        const {
            name,
            email,
            password
        } = req.body;


        // ------------------------------------------
        // CHECK REQUIRED FIELDS
        // ------------------------------------------

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }


        // ------------------------------------------
        // CHECK PASSWORD LENGTH
        // ------------------------------------------

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }


        // ------------------------------------------
        // CLEAN INPUT
        // ------------------------------------------

        const cleanName = name.trim();
        const cleanEmail = email.toLowerCase().trim();


        if (!cleanName || !cleanEmail) {
            return res.status(400).json({
                success: false,
                message: "Name and email cannot be empty"
            });
        }


        // ------------------------------------------
        // CHECK EXISTING USER
        // ------------------------------------------

        const existingUser = await User.findOne({
            email: cleanEmail
        });


        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }


        // ------------------------------------------
        // HASH PASSWORD
        // ------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ------------------------------------------
        // CREATE STUDENT
        // IMPORTANT:
        // Public registration can ONLY create students
        // ------------------------------------------

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role: "student"
        });


        // ------------------------------------------
        // CREATE JWT
        // ------------------------------------------

        const token = generateToken(user._id);


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(201).json({
            success: true,
            message: "User registered successfully",

            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },

                token: token
            }
        });


    } catch (error) {

        console.log("Register error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message
        });

    }
});


// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // ------------------------------------------
        // CHECK REQUIRED FIELDS
        // ------------------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }


        // ------------------------------------------
        // CLEAN EMAIL
        // ------------------------------------------

        const cleanEmail = email.toLowerCase().trim();


        // ------------------------------------------
        // FIND USER
        // ------------------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // ------------------------------------------
        // CHECK PASSWORD
        // ------------------------------------------

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // ------------------------------------------
        // CREATE JWT
        // ------------------------------------------

        const token = generateToken(user._id);


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(200).json({
            success: true,
            message: "Login successful",

            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },

                token: token
            }
        });


    } catch (error) {

        console.log("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });

    }
});


export default router;