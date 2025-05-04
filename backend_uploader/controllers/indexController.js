const File = require("../models/fileModel")
const Folder = require("../models/folderModel")
const User = require("../models/userModel")
const { PrismaClient } = require("@prisma/client");
const fs = require("fs")
const path = require("path")
const prisma = new PrismaClient();


const registerUser = async (req, res) => {

    const user = await prisma.users.findFirst({where: { username: req.body.username }});
    if (user) {
        return res
                .status(409)
                .json({ success: false, message: "User Already EXISTS" })
    }
    await User.createUser(req.body);
    return res
            .status(200)
            .json({ success: true, message: "User successfully registered!", error: null })
}

const currentUserGet = async (req, res) => {
    const { userId } = req.params;
    const user = await User.getCurrentUser(req.user, userId);
    return res
            .status(200)
            .json({success: true, message: "Successful!", data: { user }})
}




const fileDetailGet = async (req, res) => {
    const { file_id } = req.params;
    const fileDetail = await File.getFileDetail(req.user, file_id)
    res.render("fileDetail", {fileDetail: fileDetail})
}

// const dowloadFile = async (req, res) => {
//     const file = await prisma.file.findFirst({where: {files_id: req.params.file_id}})
//     const filePath = path.join(__dirname, file.filename)

//     if (fs.existsSync(filePath)) {
//         res.download(filePath)
//         return;
//     } else {
//         res.send("file not found")
//         return;
//     }
// }


//  the beginning of new code


const createNewFolder = async (req, res) => {
    req.query.parent_folder_id ?
        await Folder.createNewFolder(req.body, req.user, req.query.parent_folder_id) :
        await Folder.createNewFolder(req.body, req.user, null);

    return res
            .status(201).json({
                success: true,
                message: "Folder Created Successfully!"
            })
}

const fetchFolders = async (req, res) => {

    const {folders, files} = await Folder.getFolders(req.user, req.query.parent_folder_id, req.query.search ?? "");
    return res
            .status(200)
            .json({
                success: true,
                message: "Successful!",
                data: { folders, files }
            })
}


const fetchPaths = async (req, res) => {
    const paths = await Folder.getPaths(req.query.parent_folder_id ? +req.query.parent_folder_id : null);

    return res
            .status(200)
            .json({
                success: true,
                message: "Successfull!",
                data: {paths}
            })


}


const editFolderPut = async (req, res) => {
    await Folder.updateFolder(req.user, req.params.folderId, req.body);
    return res
            .status(200)
            .json({ success: true, message: "Update Successaful!" })
}



const editFilePut = async (req, res) => {
    await File.updateFile(req.body, req.params.fileId, req.user);
    return res
            .status(200)
            .json({ success: true, message: "Update Successful!" })
}

const deleteFolder = async (req, res) => {
    await Folder.deleteFolder(req.user, +req.params.folderId);
    return res
            .status(200)
            .json({ success: true, message: "Deleted Successfully!" })
}


module.exports = {
    currentUserGet,
    registerUser,
    fileDetailGet,
    createNewFolder,
    fetchFolders,
    fetchPaths,
    editFolderPut,
    editFilePut,
    deleteFolder
}