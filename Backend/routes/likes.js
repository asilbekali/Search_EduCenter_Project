/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API endpoints for managing likes
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Create a new like
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               edu_id:
 *                 type: integer
 *                 description: ID of the EduCenter to like
 *                 example: 1
 *             required:
 *               - edu_id
 *     responses:
 *       200:
 *         description: Like created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 edu_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *       400:
 *         description: Validation error
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: Delete a like
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the like to delete
 *     responses:
 *       200:
 *         description: Like deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 edu_id:
 *                   type: integer
 *                 other_field:
 *                   type: string
 *       403:
 *         description: Forbidden - user does not have permission
 *       404:
 *         description: Like not found
 *       500:
 *         description: Internal server error
 */
const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth-role.middlewars");
const likeValidation = require("../validators/likes");
const { Like, EduCenter } = require("../associations");
const route = Router();

route.post("/", authMiddleware, async (req, res) => {
  try {
    const { error } = likeValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const { edu_id, ...rest } = req.body;
    const educenter = await EduCenter.findByPk(edu_id);
    if (!educenter) {
      return res.status(404).send({ message: "EduCenter not found" });
    }

    const liked = await Like.findOne({ where: { user_id: req.user.id, edu_id } });
    if (liked) {
      return res.status(400).send({ message: "You already posted like" });
    }

    const like = await Like.create({ edu_id, user_id: req.user.id, ...rest });
    res.send(like);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    console.log(error);
  }
});

route.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      const like = await Like.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!like) {
        return res.status(403).send({ message: "Forbidden" });
      }
      await like.destroy();
      return res.send(like.dataValues);
    }
    const like = await Like.findByPk(req.params.id);
    if (!like) {
      return res.status(404).send({ message: "Not found" });
    }
    await like.destroy();
    res.send(like.dataValues);
    res.send;
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

module.exports = route;
