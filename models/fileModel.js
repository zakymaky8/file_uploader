const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

module.exports = {
    // getAllFiles: async (user) => {
    //     return await prisma.file.findMany({where: {user_id: user.users_id}});
    // },
    createInRootFile: async (user, file) => {
        await prisma.file.create({
            data: {
                filename: file.filename,
                size: file.size,
                user_id: user.users_id,
            }
        })
    },
    getInRootFiles: async (user) => {
        return await prisma.file.findMany({where: {user_id: user.users_id, folder_id: null}})
    },

    createFileInFolder: async (user, file, folder_id) => {
        await prisma.file.create({
            data: {
                filename: file.filename,
                size: file.size,
                user_id: user.users_id,
                folder_id: folder_id
            }
        })
    },
    deleteFile: async (file_id, user) => {
        await prisma.file.delete({where:{user_id: user.users_id, files_id: file_id}});
    },

    getFileDetail: async (user, file_id) => {
        const file = await prisma.file.findFirst({where: {user_id: user.users_id, files_id: file_id}})
        const folderForFile = await prisma.folder.findFirst({where: {folders_id: file.folder_id}})
        return {...file, ...folderForFile, ...user}
    }
}


async function folderArray() {
    const folder = await prisma.folder.findFirst({where: {parentId: folders_id}});
}