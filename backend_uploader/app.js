const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

const path = require("path");
const express = require("express");
const indexRouter = require("./routes/indexRoute");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("views"));

app.use("/api", indexRouter);

app.get("/", async (req, res) => {
    return res.status(200).json({ greeting_message: `Hello User, Welcome to Uploader API!`})
})

app.listen(3006 , () => {
    console.log("server is listening on port 3006");
})

