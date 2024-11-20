const File = require("../models/fileModel")
const Folder = require("../models/folderModel")
const User = require("../models/userModel")
const { PrismaClient } = require("@prisma/client");
const fs = require("fs")
const path = require("path")
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();

const getHome = async (req, res) => {
    if (!req.user) {
        res.redirect("/login")
        return
    } else {
        const folders = await Folder.getInRootFolders(req.user);
        const files = await File.getInRootFiles(req.user);
        res.render("index", {user: req.user, data: [...folders, ...files]})
    }
}

async function getArr(folder) {
    let list = []
    while (folder.parentId) {
        list.push({name: folder.folder_name, id: folder.folders_id});
        folder = await prisma.folder.findFirst({where: {folders_id: folder.parentId}});
    }
    return list.reverse()
}

async function getInRootFolderItem(folder) {
    for (let i=0; i<100; i++) {
        if (folder.parentId) {
            folder = folder = await prisma.folder.findFirst({where: {folders_id: folder.parentId}});
        } else {
            return {name: folder.folder_name, id: folder.folders_id}
        }
    }
}

const getToDataInsideFolder = async (req, res) => {
    const { folder_id } = req.params;
    const allData = await Folder.getAllDataInsideFolder(req.user, folder_id);
    const curFol = await prisma.folder.findFirst({where: {folders_id: folder_id}});
    const inrootFolder = await getInRootFolderItem(curFol)
    const path = await getArr(curFol);
    path.unshift(inrootFolder);
    res.render("index", {creationEndpt: folder_id, user: req.user, data: allData, path: path});
}

const getLoginForm = (req, res) =>  res.render("login", {errMsg: req.flash("error")})

const getSignUpForm = (req, res) => res.render("signup")

const signUserOut =  (req, res) => {
    req.logOut(err => {
        console.log(err)
    })
    res.redirect('/login')
}

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("signup", {errors: errors.array(), fieldValues: req.body});
        return;
    }
    await User.createUser(req.body);
    res.redirect("/login")
}

const createFolder = async (req, res) => {
    const { folder_id } = req.params;
    if (req.url === "/folder/new_folder") {
        await Folder.createNewFolder(req.body, req.user, undefined);
        res.redirect("/")
        return
    } else if (req.url===`/folder/${folder_id}`) {
        await Folder.createFolderInsideFolder(req.body, req.user, folder_id);
        res.redirect(`/folder/${folder_id}`);
        return;
    }
}

const createNewFile = async (req, res) => {
    const { folder_id } = req.params;
    if (req.url === "/upload") {
        await File.createInRootFile(req.user, req.file);
        res.redirect("/")
        return
    } else if (req.url === `/file_uploaded_to/${folder_id}`) {
        await File.createFileInFolder(req.user, req.file, folder_id);
        res.redirect(`/folder/${folder_id}`);
        return;
    }
}

const editFolderName = async (req, res) => {
    const { folder_id } = req.params;
    await Folder.updateFolder(req.user, folder_id, req.body);
    const folderToBeEdited = await prisma.folder.findFirst({where: {user_id: req.user.users_id, folders_id: folder_id}});
    const parentFoldr = folderToBeEdited.parentId ? await prisma.folder.findFirst({where: {user_id: req.user.users_id, folders_id: folderToBeEdited.parentId}}) : "";
    res.redirect(folderToBeEdited.parentId ? `/folder/${parentFoldr.folders_id}` : "/")
}


const deleteSingleFile = async (req, res) => {
    const { file_id } = req.params;
    const fileTobeDeleted = await prisma.file.findFirst({where:{files_id: file_id}})
    const parentFolder = fileTobeDeleted.folder_id ? await prisma.folder.findFirst({where: {folders_id: fileTobeDeleted.folder_id}}) : null;
    await File.deleteFile(file_id, req.user);
    res.redirect( parentFolder ? `/folder/${parentFolder.folders_id}` : "/")
}

const fileDetailGet = async (req, res) => {
    const { file_id } = req.params;
    const fileDetail = await File.getFileDetail(req.user, file_id)
    res.render("fileDetail", {fileDetail: fileDetail})
}

const dowloadFile = async (req, res) => {
    const file = await prisma.file.findFirst({where: {files_id: req.params.file_id}})
    const filePath = path.join("/home/zeki/repos/file_uploader/uploads", file.filename)

    if (fs.existsSync(filePath)) {
        res.download(filePath)
        return;
    } else {
        res.send("file not found")
        return;
    }
}

const deleteFolderPost = async (req, res)  => {
    const { folder_id } = req.params;
    await Folder.deleteFolder(req.user, folder_id);
    res.redirect("/")
}


module.exports = {
    getHome,
    getLoginForm,
    getSignUpForm,
    registerUser,
    signUserOut,
    createFolder,
    createNewFile,
    getToDataInsideFolder,
    editFolderName,
    deleteSingleFile,
    fileDetailGet,
    dowloadFile,
    deleteFolderPost
}