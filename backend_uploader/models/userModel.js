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
    },

    getCurrentUser: async (user, userId) => {
        const fromTheOwner = Number(user.users_id) === Number(userId);
        if (fromTheOwner) {
            const theUser = await prisma.users.findFirst({ where: {users_id: user.users_id }});
            return { ...theUser, password: "" }
        } else {
            return {}
        }
    }
}