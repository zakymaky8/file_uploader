const { Router } = require("express");
const {
      registerUser,
      createNewFolder,
      fetchFolders,
      fetchPaths,
      editFolderPut,
      editFilePut,
      deleteFolder}
= require("../controllers/indexController");

const { passport } = require("../auth/passport");
const multer = require("multer");
const cloudinary = require('../config/cloudinary');


const flash = require("connect-flash");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const session = require("express-session");

const streamifier = require("streamifier");

const { getUserToken, authenticateUser } = require("../auth/jwtauth");

const indexRouter = Router();

indexRouter.use(
    session({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000
      },
      secret: 'zeki',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

indexRouter.use(flash());
indexRouter.use(passport.session());
indexRouter.use(require("express").urlencoded({extended: false}))


const storage = multer.memoryStorage();
const upload = multer({ storage });



indexRouter.post("/signin", getUserToken)

indexRouter.post("/register", registerUser);

indexRouter.post("/folders", authenticateUser, createNewFolder);

indexRouter.get("/folders", authenticateUser, fetchFolders);

indexRouter.get("/folders/path", authenticateUser, fetchPaths);

indexRouter.put("/folders/:folderId", authenticateUser, editFolderPut)

indexRouter.put("/folders/files/:fileId", authenticateUser, editFilePut)

indexRouter.delete("/folders/:folderId", authenticateUser, deleteFolder)


indexRouter.post("/folders/files", authenticateUser, upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const mime = req.file.mimetype;

  let resourceType = "raw";

  if (mime.startsWith("image/")) {
    resourceType = "image";
  } else if (mime.startsWith("video/") || mime.startsWith("audio/")) {
    resourceType = "video";
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "FILE_UPLOADER_APP_ASSETS", resource_type: resourceType },
    async (error, cloudResult) => {
    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    try {

        await prisma.file.create({
          data: {
              filename: req.file.originalname,
              size: req.file.size,
              folder_id: req.query.parent_folder_id ? +req.query.parent_folder_id : null,
              user_id: req.user.users_id,
              sharableFileUrl: JSON.stringify(cloudResult)
           },
        });
        return res.status(201).json({
          success: true,
          message: "File uploaded successfully!",
        });
      } catch (e) {
          console.error("Error saving to DB:", e);
          return res.status(500).json({ success: false, message: "Upload failed while saving to DB." });
        }
      }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream)

})


indexRouter.delete("/folders/files/:fileId", authenticateUser, async (req, res) => {
    const file = await prisma.file.findFirst({ where: { files_id: +req.params.fileId } })

    try {
      if (file) {
        const { public_id } = JSON.parse(file.sharableFileUrl);
        await cloudinary.uploader.destroy(public_id);
        await prisma.file.delete({ where: { files_id: +req.params.fileId, user_id:  req.user.users_id} })
        return res
                .status(200)
                .json({ success: true, message: "File Deleted Successfully" })
      }

      return res
              .status(404)
              .json({ success: false, message: "File wasn't found!" })
    } catch (error) {
      return res
              .status(500)
              .json({ success: false, message: "Server Error Occured!" });
    }
})


module.exports = indexRouter
