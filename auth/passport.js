const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt")


const verifyUser = async function(username, password, done) {
    try {
        const user = await prisma.users.findFirst({where: {username: username}});
        if (!user) {
            return done(null, false, {message: `there is no user with '${username}'` })
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password!" })
            }
        }
        return done(null, user)
    } catch(err) {
        return done(err)
    }
}


passport.use(new LocalStrategy(verifyUser))

passport.serializeUser((user, done) => {
  done(null, user.users_id)
})

passport.deserializeUser( async (id, done) => {
  try {
    const user = await prisma.users.findFirst({
        where: {users_id: id}
    })
    done(null, user)
  } catch(err) {
     done(err)
  }
})

module.exports = { passport }