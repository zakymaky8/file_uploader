const express = require("express");
const path = require("path");
const multer = require("multer");
// const upload = multer({dest: "/upload/"});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.static("views"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);

        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, (new Date().toLocaleDateString()).split("/").join("") + "" + file.originalname)
    }
})

const upload = multer({storage: storage})

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/upload", upload.single('file') , (req, res) => {
    const file = req.file;
    res.send("file uploaded successfully file name: " + file.filename + "  path: " + file.path)
})



app.listen(8081, () => {
    console.log("server is listening on port 8081");
})



// app.use(
//     expressSession({
//       cookie: {
//        maxAge: 7 * 24 * 60 * 60 * 1000 // ms
//       },
//       secret: 'a santa at nasa',
//       resave: true,
//       saveUninitialized: true,
//       store: new PrismaSessionStore(
//         new PrismaClient(),
//         {
//           checkPeriod: 2 * 60 * 1000,  //ms
//           dbRecordIdIsSessionId: true,
//           dbRecordIdFunction: undefined,
//         }
//       )
//     })
//   );