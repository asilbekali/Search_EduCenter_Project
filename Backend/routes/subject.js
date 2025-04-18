const { Router } = require("express");
const loger = require("../logger");
const { Op } = require("sequelize");
const router = Router();
const { roleMiddleware } = require("../middlewares/auth-role.middlewars");
const { validateSubject } = require("../validators/subject.validator");
const Subject = require("../models/subject");

/**
 * @swagger
 * /subject:
 *   post:
 *     summary: Create a new Subject
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mathematics"
 *               image:
 *                 type: string
 *                 example: "image_url.jpg"
 *     responses:
 *       201:
 *         description: Subject created successfully
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
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", roleMiddleware(["admin"]), async (req, res) => {
    try {
        const { error, value } = validateSubject(req.body);
        const { subjects } = req.body;
        console.log(subjects);

        if (error) {
            loger.log("info", `Validation error: ${error.message}`);
            return res.status(400).send({ message: error.message });
        }
        const bazaSubject = await Subject.findOne({
            where: { name: value.name },
        });
        if (bazaSubject) {
            loger.log("info", `${value.name} - This subject already exists !`);
            return res.status(400).send({ message: "Subject already exists" });
        }
        const newSubject = await Subject.create(value);
        loger.log("info", "Created subject");
        res.status(201).send(newSubject);
    } catch (error) {
        console.log(error);
        loger.log("error", "Error in create subject");
        res.status(500).send({ message: "Server error" });
    }
});

/**
 * @swagger
 * /subject:
 *   get:
 *     summary: Get all Subjects with pagination, sorting, and filtering
 *     tags:
 *       - Subject
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
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *     responses:
 *       200:
 *         description: A list of Subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "asc", name } = req.query;
        const offset = (page - 1) * limit;
        const where = name ? { name: { [Op.like]: `%${name}%` } } : {};

        const allSubjects = await Subject.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["name", sort]],
        });

        loger.log(
            "info",
            "Get all subjects with pagination, sorting, and filtering"
        );
        res.send({
            total: allSubjects.count,
            page: parseInt(page),
            limit: parseInt(limit),
            data: allSubjects.rows,
        });
    } catch (error) {
        console.log(error);
        loger.log("error", "Error in get subject");
        res.status(500).send({ message: "Server error" });
    }
});
/**
 * @swagger
 * /subject/{id}:
 *   patch:
 *     summary: Update a Subject
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", roleMiddleware(["admin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = validateSubject(req.body);
        if (error) {
            loger.log("info", `Validation error: ${error.message}`);
            return res.status(400).send({ message: error.message });
        }

        const subject = await Subject.findByPk(id);
        if (!subject) {
            loger.log("info", `Subject with ID ${id} not found`);
            return res.status(404).send({ message: "Subject not found" });
        }

        await subject.update(value);
        loger.log("info", "Updated subject");
        res.send(subject);
    } catch (error) {
        console.log(error);
        loger.log("error", "Error in update subject");
        res.status(500).send({ message: "Server error" });
    }
});

/**
 * @swagger
 * /subject/{id}:
 *   delete:
 *     summary: Delete a Subject
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", roleMiddleware(["admin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByPk(id);
        if (!subject) {
            loger.log("info", `Subject with ID ${id} not found`);
            return res.status(404).send({ message: "Subject not found" });
        }

        await subject.destroy();
        loger.log("info", "Deleted subject");
        res.send({ message: "Subject deleted successfully" });
    } catch (error) {
        console.log(error);
        loger.log("error", "Error in delete subject");
        res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;
