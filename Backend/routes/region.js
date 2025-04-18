const { Router } = require("express");
const { roleMiddleware } = require("../middlewares/auth-role.middlewars");
const logger = require("../logger");
const Region = require("../models/region");
const { validateRegion } = require("../validators/region.validator");
const { Op } = require("sequelize");
const router = Router();

/**
 * Utility function to handle errors
 * @param {Response} res - Express response object
 * @param {Error} error - Error object
 * @param {string} message - Custom error message
 */
const handleError = (res, error, message) => {
  console.error(error);
  logger.log("error", message);
  res.status(500).send({ message });
};

/**
 * @swagger
 * /region:
 *   post:
 *     summary: Create a new region
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Regions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Region"
 *     responses:
 *       200:
 *         description: Region created successfully
 *       400:
 *         description: Validation error or region already exists
 *       500:
 *         description: Server error
 */
router.post("/", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { error, value } = validateRegion(req.body);

    if (error) {
      logger.log("error", "Validation error in region creation");
      return res
        .status(400)
        .send({ message: "Validation error: " + error.details[0].message });
    }

    const existingRegion = await Region.findOne({
      where: { name: value.name },
    });
    if (existingRegion) {
      logger.log("info", "Region already exists");
      return res.status(400).send({ message: "Region already exists" });
    }

    const newRegion = await Region.create(value);
    logger.log("info", "Region created successfully");
    res.status(200).send(newRegion);
  } catch (error) {
    handleError(res, error, "Error creating region");
  }
});

/**
 * @swagger
 * /region:
 *   get:
 *     summary: Get all regions with pagination, optional name filter, and sorting
 *     tags:
 *       - Regions
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter regions by name
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (asc for ascending, desc for descending)
 *     responses:
 *       200:
 *         description: A list of regions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of regions
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Region ID
 *                       name:
 *                         type: string
 *                         description: Region name
 *       500:
 *         description: Error fetching regions
 */

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const name = req.query.name || "";
    const sort = req.query.sort || "id";
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const regions = await Region.findAndCountAll({
      where: name ? { name: { [Op.like]: `%${name}%` } } : undefined,
      order: [[sort, order]],
      offset: (page - 1) * limit,
      limit,
    });

    logger.log(
      "info",
      "Regions fetched with pagination, optional name filter, and sorting"
    );
    res.status(200).send({
      totalItems: regions.count,
      totalPages: Math.ceil(regions.count / limit),
      currentPage: page,
      data: regions.rows,
    });
  } catch (error) {
    handleError(res, error, "Error fetching regions");
  }
});
/**
 * @swagger
 * /region/byId/{id}:
 *   get:
 *     summary: Get a region by ID
 *     tags:
 *       - Regions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region details
 *       404:
 *         description: Region not found
 *       500:
 *         description: Server error
 */
router.get("/byId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);

    if (!region) {
      logger.log("info", `Region not found with ID: ${id}`);
      return res.status(404).send({ message: "Region not found" });
    }

    logger.log("info", "Region fetched by ID");
    res.status(200).send(region);
  } catch (error) {
    handleError(res, error, "Error fetching region by ID");
  }
});

/**
 * @swagger
 * /region/{id}:
 *   patch:
 *     summary: Update a region by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Regions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Region Name"
 *     responses:
 *       200:
 *         description: Region updated successfully
 *       404:
 *         description: Region not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = validateRegion(req.body);

    if (error) {
      logger.log("error", "Validation error in region update");
      return res
        .status(400)
        .send({ message: "Validation error: " + error.details[0].message });
    }

    const region = await Region.findByPk(id);

    if (!region) {
      logger.log("info", `Region not found with ID: ${id}`);
      return res.status(404).send({ message: "Region not found" });
    }

    await region.update(value);
    logger.log("info", `Region updated successfully: ${id}`);
    res.status(200).send(region);
  } catch (error) {
    handleError(res, error, "Error updating region");
  }
});

/**
 * @swagger
 * /region/{id}:
 *   delete:
 *     summary: Delete a region by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Regions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region deleted successfully
 *       404:
 *         description: Region not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);

    if (!region) {
      logger.log("info", `Region not found with ID: ${id}`);
      return res.status(404).send({ message: "Region not found" });
    }

    await region.destroy();
    logger.log("info", `Region deleted successfully: ${id}`);
    res.status(200).send({ message: "Region deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting region");
  }
});

module.exports = router;
