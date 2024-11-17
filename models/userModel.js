const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");


module.exports = {
    createUser: async (entries) => {
        await prisma.users.create({
            data: {
                firstname: entries.firstname,
                lastname: entries.lastname,
                username: entries.username,
                password: await bcrypt.hash(entries.password, 10)
            }
        })
    }
}