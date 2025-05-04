const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary")


module.exports = {

    createNewFolder: async (entry, user, parentFolderId) => {
        const foldername = entry.folder;
        if (foldername) {
            await prisma.folder.create({
                data: {
                    folder_name: entry.folder,
                    parentId: parentFolderId ? +parentFolderId : null,
                    user_id: user.users_id
                }
            })
            return true;
        } else {
            return false;
        }
    },


    getFolders: async (user, parentId, search="") => {

        const folders = await prisma.folder.findMany({
            where: {
                    user_id: user.users_id,
                    ...(search === "" && { parentId: parentId ? +parentId : null }),
                    folder_name: { contains: search, mode: "insensitive" }
                }
        });
        const files = await prisma.file.findMany({
            where: {
                ...(search==="" && { folder_id: parentId ? +parentId : null }),
                user_id: user.users_id,
                filename: { contains: search, mode: "insensitive" }
            }
        })

        return { folders, files }
    },


    getPaths: async function (parentId) {
        const paths = [];

        async function recurse(id) {
            if (id === null) return;
            const parent = await prisma.folder.findFirst({ where: { folders_id: id } });
            if (parent) {
                paths.push(parent);
                await recurse(parent.parentId ?? null);
            }
        }

        await recurse(parentId);
        return paths.reverse();
    },

    

    getInRootFolders: async (user) => {
        return await prisma.folder.findMany({
            where: { user_id:user.users_id, parentId: null }
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
            }
        })
    },
    updateFolder: async (user, folder_id, entry) => {
        await prisma.folder.update({
            where: {
                    user_id: user.users_id,
                    folders_id: +folder_id
                },
            data: { folder_name: entry.folder }
        })
    },

    deleteFolder: async (user, folderId) => {

        const deleteFolderRecursively = async (folderId, user) => {

            const childFolders = await prisma.folder.findMany({
                where: { parentId: folderId },
            });

            for (const child of childFolders) {
                await deleteFolderRecursively(child.folders_id);
            }

            const file = await prisma.file.findFirst({ where: { folder_id: folderId } })

            if (file) {
                const { public_id } = JSON.parse(file.sharableFileUrl);
                await cloudinary.uploader.destroy(public_id);
                await prisma.file.deleteMany({where: { folder_id: folderId }});
            }


            await prisma.folder.delete({
                where: { folders_id: folderId },
            });
        };

        deleteFolderRecursively(folderId, user)
    }
}

