const { redirect } = require("react-router-dom")
const File = require("../models/fileModel")
const Folder = require("../models/folderModel")
const User = require("../models/userModel")
const { PrismaClient } = require("@prisma/client");
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

const getToDataInsideFolder = async (req, res) => {
    const { folder_id } = req.params;
    const allData = await Folder.getAllDataInsideFolder(req.user, folder_id);
    const curFol = await prisma.folder.findFirst({where: {folders_id: folder_id}});
    const path = await getArr(curFol);
    console.log(path)
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

module.exports = {
    getHome,
    getLoginForm,
    getSignUpForm,
    registerUser,
    signUserOut,
    createFolder,
    createNewFile,
    getToDataInsideFolder
}