import jwt from "jsonwebtoken"
import prisma from "../DB/db.config.js"

export const generateAccessToken = (userId) => {

    return jwt.sign(
        {
            userId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"1d"
        }
    )

}

export const generateRefreshToken = (userId) => {

    return jwt.sign(
        {
            userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:"7d"
        }
    )

}

export const createAuthSession = async (user, res) => {

    const accessToken = generateAccessToken(user.id)

    const refreshToken = generateRefreshToken(user.id)

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }
    })

    res.cookie(
        "refreshToken",
        refreshToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    return accessToken
}
// * Helper Function Over
