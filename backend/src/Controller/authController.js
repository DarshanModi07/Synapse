import prisma from "../DB/db.config.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken , createAuthSession } from "../utils/jwt.js"

export const registerUser = async (req, res) => {
    try {
        const { email, password , name } = req.body

        if (!email || !password || !name) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existingUser = await prisma.user.findUnique({
                where: {
                    email
                }
            })

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash( password,10 )

        const createdUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            })

        const accessToken = await createAuthSession(
                createdUser,
                res
            )

        return res.status(201).json({
            message: "User Registered Successfully",
            accessToken,
            user: {
                id: createdUser.id,
                email: createdUser.email
            }
        })

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            message:
                "Internal Server Error"
        })
    }

}

export const loginUser = async (req, res) => {
    try {

        const { email, password , name } = req.body

        if (!email || !password || !name) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid Credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            )

        if (!isPasswordCorrect) { 
            return res.status(401).json({
                message:
                    "Invalid Credentials"
            })
        }

        const accessToken = await createAuthSession(
                user,
                res
            )

        return res.status(200).json({
            message: "Login Successful",
            accessToken,
            user: {
                id: user.id,
                email: user.email
            }
        })

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            message:
                "Internal Server Error"
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {

        const refreshToken =
            req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                message:
                    "Refresh Token Required"
            })
        }

        const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )

        const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId
                }
            })

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid Refresh Token"
            })
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid Refresh Token"
            })
        }

        const newAccessToken = generateAccessToken(user.id)

        return res.status(200).json({
            accessToken: newAccessToken
        })

    }
    catch (error) {
        console.error(error)
        return res.status(401).json({
            message:
                "Invalid Refresh Token"
        })
    }
}

export const logoutUser = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            const user = await prisma.user.findFirst({
                    where: {
                        refreshToken
                    }
                })

            if (user) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        refreshToken: null
                    }
                })
            }
        }

        res.clearCookie("refreshToken")

        return res.status(200).json({
            message:
                "Logged Out Successfully"
        })

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            message:
                "Logout Failed"
        })
    }
}