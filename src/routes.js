const express = require("express");
const router = express.Router();
const File = require("./pdfmodels");

// Endpoint POST para subir PDF
router.post("/uploadpdf", async (req, res) => {
  try {
    // Verifica si hay archivos en la solicitud
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    let uploadedFile = req.files.file;

    // Verificar si es un PDF
    if (uploadedFile.mimetype !== "application/pdf") {
      return res.status(400).send("Only PDF files are allowed.");
    }

    const file = new File({
      filename: uploadedFile.name,
      contentType: uploadedFile.mimetype,
      data: uploadedFile.data,
    });

    await file.save();
    res.send("File uploaded successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint GET para obtener todos los archivos
router.get("/pdffiles", async (req, res) => {
  try {
    // Encuentra todos los archivos en la base de datos, excluyendo el campo 'data' para no enviar los datos binarios
    const files = await File.find({}, "-data");
    res.json(files);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint GET para descargar un archivo PDF por ID
router.get("/pdffiles/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (error) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(500).send("An error occurred while retrieving the file");
    } else {
      res.status(400).send("Invalid file ID");
    }
  }
});
module.exports = router;
