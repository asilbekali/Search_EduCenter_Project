/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Category name"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-24T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-24T12:30:00Z"
 */

/**
 * @swagger
 * /categories/all:
 *   get:
 *     summary: Get all categories with pagination and filters
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of categories to return per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page number to retrieve
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter categories by name
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort categories by creation date
 *       - in: query
 *         name: nameSort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort categories by name
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 totalCount:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Category name"
 *     responses:
 *       200:
 *         description: Created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Deleted category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/auth-role.middlewars");
const logger = require("../logger");
const Category = require("../models/category");
const categoryValidator = require("../validators/category.validator");
const { Op } = require("sequelize");

const router = require("express").Router();

router.get("/all", async (req, res) => {
  try {
    let { limit, offset, name, createdAt, nameSort } = req.query;

    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    const whereClause = {};
    const order = [];

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (createdAt) {
      order.push(["createdAt", createdAt === "asc" ? "ASC" : "DESC"]);
    }

    if (nameSort) {
      order.push(["name", nameSort === "asc" ? "ASC" : "DESC"]);
    }

    const totalCount = await Category.count({ where: whereClause });

    const categories = await Category.findAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;

    logger.log({ info: "Category fetched by user" });

    res.send({
      data: categories,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.error(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    logger.log({ info: "Category fetched by user" });
    res.send(category);
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { error } = categoryValidator.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const one = await Category.findOne({ where: { name: req.body.name } });
    if (one) {
      return res.status(400).send({ message: "This category already exists" });
    }
    const newCategory = await Category.create(req.body);
    logger.log({ info: "Category posted by admin", user: req.user.id });
    res.send(newCategory);
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.patch(
  "/:id",
  roleMiddleware(["admin", "super-admin"]),
  async (req, res) => {
    try {
      const { error } = categoryValidator.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      const one = await Category.findByPk(req.params.id);
      if (!one) {
        return res.status(404).send({ message: "Category not found" });
      }
      await one.update(req.body);
      logger.log({ info: "Category patched by admin", user: req.user.id });
      res.send(one);
    } catch (error) {
      console.log(error);
      logger.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.delete("/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const one = await Category.findByPk(req.params.id);
    if (!one) {
      return res.status(404).send({ message: "Category not found" });
    }
    await one.destroy();
    logger.log({ info: "Category deleted by admin", user: req.user.id });
    res.send(one.dataValues);
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
