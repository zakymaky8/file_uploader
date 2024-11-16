const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const verifyUser = async function(username, password, done) {
    const user = await prisma.users.findFirst()
}


passport.use(new LocalStrategy(verifyUser))
