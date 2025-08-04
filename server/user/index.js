const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.single("file"), (req, res) => res.send("Uploaded"));

app.listen(3000, () => console.log("http://localhost:3000"));
