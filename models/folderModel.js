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
    getAllDataInsideFolder: async (user, folder_id) => {
        const folders = await prisma.folder.findMany({
            where: {
                user_id: user.users_id,
                parentId: folder_id
            }
        });
        const files = await prisma.file.findMany({
            where: {
                user_id: user.users_id,
                folder_id: folder_id
            }
        })
        return [...folders, ...files]
    },

    createFolderInsideFolder: async (entry, user, folder_id) => {
        await prisma.folder.create({
            data: {
                folder_name: entry.folder,
                parentId: folder_id,
                user_id: user.users_id,
                parentId: folder_id
            }
        })
    },
    updateFolder: async (user, folder_id, entry) => {
        await prisma.folder.update({
            where: {user_id: user.users_id,folders_id: folder_id},
            data: { folder_name: entry.folder }
        })
    },
    deleteFolder: async (user, folder_id) => {
        await prisma.folder.delete({where: {user_id: user.users_id, folders_id: folder_id}});
        // here is undesirable and unoptimal way of deleting this approach only deletes the
        //  parent folder but doesn't what inside it might seem well done on the view but on database
        //  there are still files which aren't deleted
    }
}