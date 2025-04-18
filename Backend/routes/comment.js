/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API endpoints for managing comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the comment
 *         text:
 *           type: string
 *           description: The content of the comment
 *         edu_id:
 *           type: integer
 *           description: The branch ID where the comment is being made
 *         star:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the comment was last updated
 *
 *     CommentUpdateInput:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Updated text of the comment
 *         star:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Updated rating from 1 to 5
 */

/**
 * @swagger
 * /comments/all:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of comments to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order for creation date
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter comments by user ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 totalCount:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - edu_id
 *               - star
 *             properties:
 *               text:
 *                 type: string
 *                 description: The content of the comment
 *               edu_id:
 *                 type: integer
 *                 description: The branch ID where the comment is being made
 *               star:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *     responses:
 *       200:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentUpdateInput'
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
const express = require("express");
const { Comment, User, EduCenter } = require("../associations");
const router = express.Router();
const {
  roleMiddleware,
  authMiddleware,
} = require("../middlewares/auth-role.middlewars");
const logger = require("../logger");
const {
  commentValidation,
  commentUpdateValidation,
} = require("../validators/comment");

router.get("/all", roleMiddleware(["admin"]), async (req, res) => {
  try {
    let { limit, offset, createdAt, user_id } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    const whereClause = {};
    const order = [];

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (createdAt) {
      order.push(["createdAt", createdAt === "asc" ? "ASC" : "DESC"]);
    }

    const totalCount = await Comment.count({ where: whereClause });
    const all = await Comment.findAll({
      where: whereClause,
      limit,
      offset,
      order,
      include: [
        { model: EduCenter, as: "eduCenter", attributes: ["name"] },
        { model: User, as: "user", attributes: ["name"] },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;

    logger.info("Admin fetched all users");
    res.send({
      data: all,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: EduCenter, as: "eduCenter", attributes: ["name"] },
        { model: User, as: "user", attributes: ["name"] },
      ],
    });
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    res.send(comment);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { error } = commentValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const eduCenter = await EduCenter.findByPk(req.body.edu_id);
    if (!eduCenter) {
      return res.status(404).send({ message: "EduCenter not found !" });
    }

    const comment = await Comment.create({ ...req.body, user_id: req.user.id });

    res.send(comment);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.patch("/:id", roleMiddleware(["admin", "user"]), async (req, res) => {
  try {
    if (req.user.role != "admin") {
      const one = await Comment.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!one) {
        return res.status(403).send({ message: "Forbidden" });
      }
      const { error } = commentUpdateValidation.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      await one.update(req.body);
      return res.send({ message: "Comment updated" });
    }
    const one = await Comment.findByPk(req.params.id);
    if (!one) {
      return res.status(404).send({ message: "Not found" });
    }
    const { error } = commentUpdateValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    await one.update(req.body);
    res.send(one);
  } catch (error) {
    res.status(500).json({ error: "Error-500: Server error" });
  }
});

router.delete("/:id", roleMiddleware(["admin", "user"]), async (req, res) => {
  try {
    if (req.user.role != "admin") {
      const one = await Comment.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!one) {
        return res.status(403).send({ message: "Forbidden" });
      }
      await one.destroy(req.body);
      return res.send({ message: "Comment deleted" });
    }
    const one = await Comment.findByPk(req.params.id);
    if (!one) {
      return res.status(404).send({ message: "Not found" });
    }
    await one.destroy();
    res.send(one.dataValues);
  } catch (error) {
    res.status(500).json({ error: "Error-500: Server error" });
  }
});

module.exports = router;
