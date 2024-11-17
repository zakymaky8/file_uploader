const { redirect } = require("react-router-dom")
const File = require("../models/fileModel")
const Folder = require("../models/folderModel")
const User = require("../models/userModel")

const getHome = async (req, res) => {
    if (!req.user) {
        res.redirect("/login")
        return
    } else {
        const folders = await Folder.getInRootFolders(req.user);
        const files = await File.getInRootFiles(req.user);
        console.log(...[folders, ...files]);
        res.render("index", {user: req.user, data: [...folders, ...files]})
    }
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
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// (async()=>prisma.folder.deleteMany())()
const createFolder = async (req, res) => {
    await Folder.createNewFolder(req.body, req.user, undefined);
    // console.log(await prisma.folder.findMany())
    res.redirect("/")
    res.end()
}

const createNewFile = async (req, res) => {
    await File.createInRootFile(req.user, req.file);
    res.redirect("/")
}

module.exports = {
    getHome,
    getLoginForm,
    getSignUpForm,
    registerUser,
    signUserOut,
    createFolder,
    createNewFile
}