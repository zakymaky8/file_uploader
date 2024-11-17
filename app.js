const express = require("express");
const path = require("path");
const indexRouter = require("./routes/indexRoute")

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use(express.urlencoded({extended: false}));
app.use(express.static("views"))



app.listen(8081, () => {
    console.log("server is listening on port 8081");
})

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async()=> console.log(await prisma.users.findMany()))()