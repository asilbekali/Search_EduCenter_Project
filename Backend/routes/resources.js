/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management API
 */

/**
 * @swagger
 * /resources/all:
 *   get:
 *     summary: Get all resources with pagination and filters
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of resources per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter resources by name
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by creation date
 *       - in: query
 *         name: nameSort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by name
 *     responses:
 *       200:
 *         description: List of resources
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: NodeJs
 *               description:
 *                 type: string
 *                 example: For beginners
 *               file:
 *                 type: string
 *                 example: https://example.com/file.pdf
 *               link:
 *                 type: string
 *                 example: https://example.com/course
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 example: https://example.com/image.png
 *             required:
 *               - name
 *               - description
 *               - category_id
 *     responses:
 *       200:
 *         description: Resource created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /resources/{id}:
 *   patch:
 *     summary: Update a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     summary: Delete a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */

const { authMiddleware } = require("../middlewares/auth-role.middlewars");
const logger = require("../logger");
const { Resource, Category, User } = require("../associations");
const { Op } = require("sequelize");
const router = require("express").Router();
const {
  resourceValidator,
  resourceUpdateValidator,
} = require("../validators/resource.validator");

router.get("/all", async (req, res) => {
  try {
    let { limit, offset, name, nameSort, createdAt, categoryId } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    const whereClause = {};
    const order = [];

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (categoryId) {
      whereClause.category_id = categoryId;
    }

    if (createdAt) {
      order.push(["createdAt", createdAt === "asc" ? "ASC" : "DESC"]);
    }

    if (nameSort) {
      order.push(["name", nameSort === "asc" ? "ASC" : "DESC"]);
    }

    const totalCount = await Resource.count({ where: whereClause });
    const all = await Resource.findAll({
      where: whereClause,
      limit,
      offset,
      include: [
        { model: Category, attributes: ["name"] },
        { model: User, attributes: ["name"] },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;
    logger.log({ info: "User fetched all resources" });
    res.send({
      data: all,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["name"] },
        { model: User, attributes: ["name"] },
      ],
    });
    if (resource) {
      logger.info("User fetched resource by id");
      res.send(resource);
    } else {
      logger.error("Resource not found");
      res.status(404).send({ message: "Resource not found" });
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { error } = resourceValidator.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { category_id, ...rest } = req.body;
    const category = await Category.findOne({ where: { id: category_id } });
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    const resource = await Resource.create({
      ...rest,
      category_id,
      user_id: req.user.id,
    });
    logger.info("User created resource");
    res.send(resource);
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      const resource = await Resource.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!resource) {
        return res.status(404).send({ message: "Resource not found" });
      }
      const { error } = resourceUpdateValidator.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      await resource.update(req.body);
      logger.info("User updated resource");
      return res.send(resource);
    } else if (req.user.role === "admin" || req.user.role === "super-admin") {
      const resource = await Resource.findByPk(req.params.id);
      if (!resource) {
        return res.status(404).send({ message: "Resource not found" });
      }
      const { error } = resourceUpdateValidator.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      await resource.update(req.body);
      logger.info("Admin updated resource");
      res.send(resource);
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      const resource = await Resource.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!resource) {
        return res.status(404).send({ message: "Resource not found" });
      }
      const { error } = resourceUpdateValidator.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      await resource.destroy();
      logger.info("User deleted resource");
      return res.send(resource.dataValues);
    } else if (req.user.role === "admin" || req.user.role === "super-admin") {
      const resource = await Resource.findByPk(req.params.id);
      if (!resource) {
        return res.status(404).send({ message: "Resource not found" });
      }
      await resource.destroy();
      logger.info("Admin deleted resource");
      res.send(resource.dataValues);
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
