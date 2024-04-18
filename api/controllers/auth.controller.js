import express from 'express';
import bcrypt from 'bcrypt';
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';

//Register
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username/email/password" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "user registerd with this email alredy exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

//login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "User Does not exit" });
        }

        const ispasswordvalid = await bcrypt.compare(password, user.password);
        if (!ispasswordvalid) {
            return res.status(400).json({ message: "Password does not match" });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set token as a cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure:true, // Uncomment this line if using HTTPS
            maxAge: 3600000, // 1 hour in milliseconds
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("error logging in", error);
        res.status(500).json({ message: "error logging in" });
    }

};

//logout
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

