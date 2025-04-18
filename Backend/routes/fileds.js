const { Router } = require("express");
const loger = require("../logger");
const Fileds = require("../models/fileds");
const { roleMiddleware } = require("../middlewares/auth-role.middlewars");
const { validateFileds } = require("../validators/fields.validator");
const { Op } = require("sequelize");

const router = Router();

/**
 * @swagger
 * /fields:
 *   post:
 *     summary: Create a new field
 *     tags:
 *       - Fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Field"
 *               image:
 *                 type: string
 *                 example: "image.png"
 *     responses:
 *       200:
 *         description: Field created successfully
 *       400:
 *         description: Validation error or field already exists
 *       500:
 *         description: Server error
 */
router.post("/", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { error, value } = validateFileds(req.body);
    if (error) {
      loger.log("error", "Error in validation post router");
      return res.status(400).send({ message: "Validation error" });
    }
    const bazaField = await Fileds.findOne({ where: { name: value.name } });
    if (bazaField) {
      loger.log("info", `${value.name} - this field already exists`);
      return res.status(400).send({ message: "This field already exists" });
    }
    const newField = await Fileds.create({
      name: value.name,
      image: value.image || "No image",
    });
    loger.log("info", `New field created: ${value.name}`);
    res.status(200).send(newField);
  } catch (error) {
    console.log(error);
    loger.log("error", "Error in create field");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /fields:
 *   get:
 *     summary: Get all fields with pagination, sorting, and name filtering
 *     tags:
 *       - Fields
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (asc for ascending, desc for descending)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *     responses:
 *       200:
 *         description: A list of fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "asc", name = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const fields = await Fileds.findAndCountAll({
      where: name ? { name: { [Op.like]: `%${name}%` } } : undefined,
      offset: (pageNumber - 1) * limitNumber,
      limit: limitNumber,
      order: [["id", sort.toLowerCase() === "desc" ? "DESC" : "ASC"]],
    });

    loger.log(
      "info",
      "Fields fetched with pagination, sorting, and name filtering"
    );
    res.status(200).send({
      totalItems: fields.count,
      totalPages: Math.ceil(fields.count / limitNumber),
      currentPage: pageNumber,
      data: fields.rows,
    });
  } catch (error) {
    console.log(error);
    loger.log("error", "Error fetching fields");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /fields/{id}:
 *   get:
 *     summary: Get a field by ID
 *     tags:
 *       - Fields
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 image:
 *                   type: string
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const field = await Fileds.findByPk(id);
    if (!field) {
      loger.log("info", `Field with ID ${id} not found`);
      return res.status(404).send({ message: "Field not found" });
    }

    res.send(field);
  } catch (error) {
    console.log(error);
    loger.log("error", "Error updating field");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /fields/{id}:
 *   patch:
 *     summary: Update a field by ID
 *     tags:
 *       - Fields
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Field Name"
 *               image:
 *                 type: string
 *                 example: "image.png"
 *     responses:
 *       200:
 *         description: Field updated successfully
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id",
  roleMiddleware(["admin", "super-admin"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const field = await Fileds.findByPk(id);
      if (!field) {
        loger.log("info", `Field with ID ${id} not found`);
        return res.status(404).send({ message: "Field not found" });
      }
      const { error, value } = validateFileds(req.body);
      if (error) {
        loger.log("error", "Validation failed");
        return res.status(500).send({ message: "Validation failed" });
      }
      await field.update({
        name: value.name,
        image: value.image || "No image",
      });
      loger.log("info", `Field updated: ${id}`);
      res.status(200).send(field);
    } catch (error) {
      console.log(error);
      loger.log("error", "Error updating field");
      res.status(500).send({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /fields/{id}:
 *   delete:
 *     summary: Delete a field by ID
 *     tags:
 *       - Fields
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field deleted successfully
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", roleMiddleware(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    const field = await Fileds.findByPk(id);
    if (!field) {
      loger.log("info", `Field with ID ${id} not found`);
      return res.status(404).send({ message: "Field not found" });
    }
    await field.destroy();
    loger.log("info", `Field deleted: ${id}`);
    res.status(200).send({ message: "Field deleted successfully" });
  } catch (error) {
    console.log(error);
    loger.log("error", "Error deleting field");
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
