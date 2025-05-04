const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

require("dotenv").config()

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken");





const getUserToken = async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const user = await prisma.users.findUnique( { where: { username: username } } )
        if (user) {
            const matches = await bcrypt.compare(password, user.password)
            if (matches) {
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                return res.status(200).json({ success: true, message: "Successfully Logged In!", token })
            }
            return res.status(400).json({ success: false, message: "Password Incorrect!" })
        }
        return res.status(400).json({ success: false, message: "Invalid Credential!" })
    }
}


const authenticateUser = async (req, res, next) => {SW
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearerToken = bearerHeader.split(" ")[1]
        jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({ success: false, message: "Unautorized", data: null })
            } else {
                req.user = user
                next()
                // res.status(200).json({ success: true, message: "successfull", data: user })
            }
        })
    }
}


module.exports = {
    authenticateUser,
    getUserToken
}