const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();


module.exports = {
    getAllFolders: async (user) => {
        return await prisma.folder.findMany({
            where: {user_id: user.users_id}
        });
    },
    createNewFolder: async (entry, user, parentFolder) => {
        await prisma.folder.create({
            data: {
                folder_name: entry.folder,
                parentId: parentFolder ? parentFolder.folders_id : undefined,
                user_id: user.users_id
            }
        })
    },
    getInRootFolders: async (user) => {
        return await prisma.folder.findMany({
            where: {user_id:user.users_id,  parentId: null }
        });
    },
    getAllFoldersInsideFolder: async () => {

    }
}