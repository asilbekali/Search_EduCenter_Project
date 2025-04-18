/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload/single:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: No files uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /upload/{filename}:
 *   get:
 *     summary: Retrieve a file by filename
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth-role.middlewars");
const logger = require("../logger");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/single", authMiddleware, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    logger.log({ info: `User uploaded file: ${fileUrl}` });
    res.send({
      link: fileUrl,
    });
  } catch (error) {
    console.error(error);
    logger.log({ error: `User could not upload file` });
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post(
  "/multiple",
  authMiddleware,
  upload.array("files", 5),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: "No files uploaded" });
      }

      const fileUrls = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
      logger.log({ info: `User uploaded files: ${fileUrls}` });
      res.send({
        links: fileUrls,
      });
    } catch (error) {
      console.error(error);
      logger.log({ error: `User could not upload files` });
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/:filename", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads", req.params.filename);
    res.sendFile(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
