const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

module.exports = {
    getAllFiles: async (user) => {
        return await prisma.file.findMany({where: {user_id: user.users_id}});
    },
    createInRootFile: async (user, file, folder) => {
        await prisma.file.create({
            data: {
                filename: file.filename,
                size: file.size,
                user_id: user.users_id
            }
        })
    },
    getInRootFiles: async (user) => {
        return await prisma.file.findMany({where: {user_id: user.users_id, folders: undefined}})
    }
}


async function folderArray() {
    const folder = await prisma.folder.findFirst({where: {parentId: folders_id}});
}