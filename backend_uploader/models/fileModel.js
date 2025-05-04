const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

module.exports = {
    getAllFiles: async () => {
        console.log(await prisma.file.findMany());
    },

    updateFile: async (entries, fileId, user) => {
        await prisma.file.update({
            where: {files_id: +fileId, user_id: +user.users_id},
            data: {filename: entries.filename}
        })
    },


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
                folder_id: folder_id,
                sharableFileUrl: ""
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

module.exports.getAllFiles()
