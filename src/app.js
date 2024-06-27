const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fileRoutes = require("./routes");

const app = express();

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/fileuploads", {});

// Middleware
app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: { fileSize: 160 * 1024 * 1024 }, // 160 MB limit
    createParentPath: true,
  })
);

// Rutas
app.use("/api", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
