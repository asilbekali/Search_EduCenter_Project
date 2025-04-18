/**
 * @swagger
 * /my-sessions:
 *   get:
 *     summary: Retrieve all sessions for the authenticated user
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No sessions found
 *       500:
 *         description: Internal server error
 *
 * /my-sessions/{id}:
 *   delete:
 *     summary: Delete a specific session for the authenticated user
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the session to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
const { authMiddleware } = require("../middlewares/auth-role.middlewars");
const logger = require("../logger");
const Session = require("../models/session");

const router = require("express").Router();

router.get("/my-sessions", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: {
        user_id: req.user.id,
      },
    });
    if (!sessions) {
      return res.status(404).send({ message: "No sessions found" });
    }
    logger.log("info", `User ${req.user.id} fetched his sessions`);
    res.send(sessions);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
    logger.log(
      "error",
      `User ${req.user.id} faced error to fetch his sessions`
    );
  }
});

router.delete("/my-sessions/:id", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!session) {
      return res.status(404).send({ message: "Session not found" });
    }
    await session.destroy();
    logger.log("info", `User ${req.user.id} deleted his session`);
    res.send({ message: "Session deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
    logger.log(
      "error",
      `User ${req.user.id} faced error to delete his session`
    );
  }
});

module.exports = router;
