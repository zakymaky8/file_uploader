const { Router } = require("express");
const { getHome, getLoginForm, getSignUpForm, registerUser, signUserOut, createFolder, createNewFile, getToDataInsideFolder, editFolderName, deleteSingleFile, fileDetailGet, dowloadFile, deleteFolderPost } = require("../controllers/indexController");
const { passport } = require("../auth/passport");
const multer = require("multer");
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const { validateRegistration } = require("../middlewares/validate")

const flash = require("connect-flash");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const session = require("express-session")

const indexRouter = Router();

indexRouter.use(
    session({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'zeki',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

indexRouter.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // ms
       },
    secret: 'zeki',
    resave: false,
    saveUninitialized: false,
    rolling: true,
}))


indexRouter.use(flash());
indexRouter.use(passport.session());
indexRouter.use(require("express").urlencoded({extended: false}))

const store = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'mp4', 'mp3', 'txt'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
})

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + file.originalname)
//     }
// })
const upload = multer({storage: store})

indexRouter.get("/", getHome);
indexRouter.get("/login", getLoginForm);
indexRouter.get("/register", getSignUpForm);
indexRouter.post("/register", validateRegistration, registerUser);
indexRouter.post("/login",
            passport.authenticate(
                        "local",
                        {
                            failureRedirect: "/login",
                            successRedirect: "/",
                            failureFlash: true,
                            failureMessage: "Incorrect username or password!"
                        }
    )
);

indexRouter.get("/singout", signUserOut)

indexRouter.post("/folder/new_folder", createFolder);

indexRouter.post("/folder/:folder_id", createFolder);
indexRouter.get("/folder/:folder_id", getToDataInsideFolder)

indexRouter.post("/upload", upload.single("file"), createNewFile)

indexRouter.post("/file_uploaded_to/:folder_id", upload.single("file"), createNewFile)

indexRouter.post("/folder/update/:folder_id", editFolderName)

indexRouter.post("/file/delete/:file_id", deleteSingleFile)

indexRouter.get("/file/details/:file_id", fileDetailGet)

indexRouter.get("/file/download/:file_id", dowloadFile)

indexRouter.post("/folder/delete/:folder_id", deleteFolderPost)



module.exports = indexRouter

