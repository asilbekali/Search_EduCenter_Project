const { Router } = require("express");
const {
  roleMiddleware,
  authMiddleware,
} = require("../middlewares/auth-role.middlewars");
const { Op } = require("sequelize");
const loger = require("../logger");
const { validEdu, validEduUpdate } = require("../validators/eduValidation");
const {
  Region,
  User,
  Subjet,
  EduCenter,
  Comment,
  Fields,
  Branch,
  Like,
} = require("../associations");
const eduCentersSubject = require("../models/educenterSubject");
const eduCentersField = require("../models/educenterField");
const router = Router();

/**
 * @swagger
 * /eduCenter:
 *   post:
 *     summary: Create a new EduCenter
 *     tags:
 *       - EduCenter
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
 *                 example: "EduCenter A"
 *               region_id:
 *                 type: integer
 *                 example: 1
 *               location:
 *                 type: string
 *                 example: "Tashkent"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               image:
 *                 type: string
 *                 example: "image.png"
 *               subjects:
 *                 type: array
 *                 example: [1, 2, 4]
 *               fields:
 *                 type: array
 *                 example: [3, 5, 7]
 *     responses:
 *       201:
 *         description: EduCenter created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", roleMiddleware(["ceo", "admin"]), async (req, res) => {
  try {
    const { error, value } = validEdu(req.body);
    if (error) {
      loger.log("info", "Error in validation edu center");
      return res.status(400).send({ message: error.details[0].message });
    }

    const region = await Region.findOne({ where: { id: value.region_id } });
    if (!region) {
      loger.log("info", "Created edu center region not found");
      return res
        .status(404)
        .send({ message: "Create edu center region not found" });
    }

    const uniqueSubjectIds = [...new Set(value.subjects)];
    const uniqueFieldIds = [...new Set(value.fields)];

    const existingSubjects = await Subjet.findAll({
      where: { id: uniqueSubjectIds },
      attributes: ["id"],
    });
    const existingSubjectIds = existingSubjects.map((subject) => subject.id);
    const missingSubjects = uniqueSubjectIds.filter(
      (id) => !existingSubjectIds.includes(id)
    );
    if (missingSubjects.length > 0) {
      loger.log("info", "Some subjects not found in database");
      return res.status(400).send({
        message: `The following subjects do not exist: ${missingSubjects.join(
          ", "
        )}`,
      });
    }

    const existingFields = await Fields.findAll({
      where: { id: uniqueFieldIds },
      attributes: ["id"],
    });
    const existingFieldIds = existingFields.map((field) => field.id);
    const missingFields = uniqueFieldIds.filter(
      (id) => !existingFieldIds.includes(id)
    );
    if (missingFields.length > 0) {
      loger.log("info", "Some fields not found in database");
      return res.status(400).send({
        message: `The following fields do not exist: ${missingFields.join(
          ", "
        )}`,
      });
    }
    const eduName = await EduCenter.findOne({ where: { name: value.name } });

    if (eduName) {
      return res
        .status(400)
        .send({ message: "This EduCenter already exists please change name" });
    }

    const eduPhone = await EduCenter.findOne({ where: { phone: value.phone } });
    if (eduPhone) {
      return res.status(400).send({
        message: "This EduCenter already exists please change phone number",
      });
    }

    const newEduCenter = await EduCenter.create({
      name: value.name,
      region_id: value.region_id,
      location: value.location,
      phone: value.phone,
      image: value.image || "No image",
      user_id: req.user.id,
    });

    const subjects = uniqueSubjectIds.map((id) => ({
      edu_id: newEduCenter.id,
      subject_id: id,
    }));
    await eduCentersSubject.bulkCreate(subjects);

    const fields = uniqueFieldIds.map((id) => ({
      edu_id: newEduCenter.id,
      field_id: id,
    }));
    await eduCentersField.bulkCreate(fields);

    loger.log("info", "EduCenter Created");
    res.status(201).send(newEduCenter);
  } catch (error) {
    console.error(error);
    loger.log("error", "Error in create EduCenter");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /eduCenter/my-educenters:
 *   get:
 *     summary: Foydalanuvchining o‘ziga tegishli ta’lim markazlarini olish
 *     tags:
 *       - EduCenter
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami (pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Bir sahifada nechta element chiqarish kerakligi
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Tartib bo‘yicha saralash (yaratilgan sana asosida)
 *       - in: query
 *         name: fields_name
 *         schema:
 *           type: string
 *         description: Ma’lum yo‘nalish (field) bo‘yicha qidirish
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: integer
 *         description: Hudud bo‘yicha qidirish (Region ID)
 *       - in: query
 *         name: subjects
 *         schema:
 *           type: string
 *         description: Fanlar bo‘yicha qidirish (Subject Name)
 *     responses:
 *       200:
 *         description: Foydalanuvchining ta’lim markazlari ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Jami topilgan ta’lim markazlari soni
 *                 totalPages:
 *                   type: integer
 *                   description: Umumiy sahifalar soni
 *                 currentPage:
 *                   type: integer
 *                   description: Joriy sahifa raqami
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       region:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       subjects:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *       500:
 *         description: Server xatosi
 */
router.get("/my-educenters", authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "asc",
      fields_name,
      region_id,
      subjects,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const whereClause = { user_id: req.user.id };
    if (region_id) {
      whereClause["region_id"] = region_id;
    }

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Region,
        as: "region",
        attributes: ["id", "name"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "text", "star", "user_id"],
      },
      {
        model: Fields,
        as: "fields",
        attributes: ["id", "name"],
        where: fields_name
          ? { name: { [Op.like]: `%${fields_name}%` } }
          : undefined,
      },
      {
        model: Branch,
        as: "eduCenter",
        attributes: ["id", "name", "address", "phone"],
      },
      {
        model: Subjet,
        as: "subjects",
        attributes: ["id", "name"],
        where: subjects ? { name: { [Op.like]: `%${subjects}%` } } : undefined,
      },
      {
        model: Like,
        attributes: ["id"],
      },
    ];

    const eduCenters = await EduCenter.findAndCountAll({
      where: whereClause,
      offset: (pageNumber - 1) * limitNumber,
      limit: limitNumber,
      order: [["createdAt", sort.toLowerCase() === "desc" ? "DESC" : "ASC"]],
      include: includeClause,
    });

    // Sharhlarning o'rtacha bahosini hisoblash va like count qo'shish
    const data = eduCenters.rows.map((eduCenter) => {
      const comments = eduCenter.comments || [];
      const likeCount = eduCenter.Likes ? eduCenter.Likes.length : 0;

      const averageStar =
        comments.length > 0
          ? comments.reduce((acc, comment) => acc + comment.star, 0) /
            comments.length
          : 0;

      return {
        ...eduCenter.toJSON(),
        averageStar: parseFloat(averageStar.toFixed(1)), // O‘rtacha yulduz reytingini 1 kasr o‘rindagi raqam bilan chiqarish
        likeCount,
      };
    });

    loger.log(
      "info",
      "EduCenters fetched with pagination, sorting, and filtering by region ID, fields name, and subject name"
    );
    res.status(200).send({
      totalItems: eduCenters.count,
      totalPages: Math.ceil(eduCenters.count / limitNumber),
      currentPage: pageNumber,
      data,
    });
  } catch (error) {
    console.error(error);
    loger.log("error", "Error fetching EduCenters");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /eduCenter:
 *   get:
 *     summary: Get all EduCenters with pagination, sorting, and optional filtering by region ID, fields name, and subject name
 *     tags:
 *       - EduCenter
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
 *         name: fields_name
 *         schema:
 *           type: string
 *         description: Filter EduCenters by fields name (e.g., "Programming")
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: integer
 *         description: Filter EduCenters by region ID
 *       - in: query
 *         name: subjects
 *         schema:
 *           type: string
 *         description: Filter EduCenters by subject name (e.g., "Mathematics")
 *     responses:
 *       200:
 *         description: A list of EduCenters
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
 *                       region:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       fields:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                       subjects:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *       500:
 *         description: Server error
 */

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "asc",
      fields_name,
      region_id,
      subjects,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const whereClause = {};
    if (region_id) {
      whereClause["region_id"] = region_id;
    }

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Region,
        as: "region",
        attributes: ["id", "name"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "text", "star"],
      },
      {
        model: Fields,
        as: "fields",
        attributes: ["id", "name"],
        where: fields_name
          ? { name: { [Op.like]: `%${fields_name}%` } }
          : undefined,
      },
      {
        model: Branch,
        as: "eduCenter",
        attributes: ["id", "name", "address", "phone"],
      },
      {
        model: Subjet,
        as: "subjects",
        attributes: ["id", "name"],
        where: subjects
          ? { name: { [Op.like]: `%${subjects}%` } } // Filter by subject name
          : undefined,
      },
      {
        model: Like,
        attributes: ["id"],
      },
    ];

    const eduCenters = await EduCenter.findAndCountAll({
      where: whereClause,
      offset: (pageNumber - 1) * limitNumber,
      limit: limitNumber,
      order: [["createdAt", sort.toLowerCase() === "desc" ? "DESC" : "ASC"]],
      include: includeClause,
    });

    // Sharhlarning o'rtacha bahosini hisoblash va like count qo'shish
    const data = eduCenters.rows.map((eduCenter) => {
      const comments = eduCenter.comments || [];
      const likeCount = eduCenter.Likes ? eduCenter.Likes.length : 0;

      const averageStar =
        comments.length > 0
          ? comments.reduce((acc, comment) => acc + comment.star, 0) /
            comments.length
          : 0;

      return {
        ...eduCenter.toJSON(),
        averageStar: parseFloat(averageStar.toFixed(1)), // O‘rtacha yulduz reytingini 1 kasr o‘rindagi raqam bilan chiqarish
        likeCount,
      };
    });

    loger.log(
      "info",
      "EduCenters fetched with pagination, sorting, and filtering by region ID, fields name, and subject name"
    );
    res.status(200).send({
      totalItems: eduCenters.count,
      totalPages: Math.ceil(eduCenters.count / limitNumber),
      currentPage: pageNumber,
      data,
    });
  } catch (error) {
    console.error(error);
    loger.log("error", "Error fetching EduCenters");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /eduCenter/{id}:
 *   get:
 *     summary: Get an EduCenter by ID
 *     tags:
 *       - EduCenter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: EduCenter ID
 *     responses:
 *       200:
 *         description: EduCenter details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 region_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 location:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const eduCenter = await EduCenter.findOne({
      where: { id: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Region,
          as: "region",
          attributes: ["id", "name"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "text", "star"],
        },
        {
          model: Like,
          attributes: ["id"],
        },
        {
          model: Branch,
          as: "eduCenter",
          attributes: ["id", "name", "address", "phone"],
        },
      ],
    });
    if (!eduCenter) {
      loger.log("info", `EduCenter with ID ${id} not found`);
      return res.status(404).send({ message: "EduCenter not found" });
    }

    loger.log("info", `EduCenter fetched by ID: ${id}`);
    res.status(200).send(eduCenter);
  } catch (error) {
    console.log(error);
    loger.log("error", "Error fetching EduCenter by ID");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /eduCenter/{id}:
 *   patch:
 *     summary: Update an EduCenter by ID
 *     tags:
 *       - EduCenter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: EduCenter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated EduCenter"
 *               region_id:
 *                 type: integer
 *                 example: 1
 *               location:
 *                 type: string
 *                 example: "Samarkand"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *
 *     responses:
 *       200:
 *         description: EduCenter updated successfully
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", roleMiddleware(["ceo", "admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    const { error, value } = validEduUpdate(req.body);
    if (req.user.role != "admin") {
      const one = await EduCenter.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!one) {
        loger.log("info", `This edue center not ${value.name} ceo`);
        return res.status(403).send({ message: "This not your edu center" });
      }
      if (error) {
        loger.log("error", "Validation error in update EduCenter");
        return res.status(400).send({ message: error.details[0].message });
      }
      if (req.body.region_id) {
        const reg = await Region.findByPk(req.body.region_id);
        if (!reg) {
          return res.status(404).send({ message: "Region not found" });
        }
      }
      const eduCenter = await EduCenter.findByPk(id);
      if (!eduCenter) {
        loger.log("info", `EduCenter with ID ${id} not found`);
        return res.status(404).send({ message: "EduCenter not found" });
      }

      await eduCenter.update(value);
      loger.log("info", `EduCenter updated: ${id}`);
      return res.status(200).send(eduCenter);
    }

    const eduCenter = await EduCenter.findByPk(id);
    if (!eduCenter) {
      loger.log("info", `EduCenter with ID ${id} not found`);
      return res.status(404).send({ message: "EduCenter not found" });
    }

    await eduCenter.update(value);
    loger.log("info", `EduCenter updated: ${id}`);
    res.status(200).send(eduCenter);
  } catch (error) {
    console.log(error);
    loger.log("error", "Error updating EduCenter");
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @swagger
 * /eduCenter/{id}:
 *   delete:
 *     summary: Delete an EduCenter by ID
 *     tags:
 *       - EduCenter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: EduCenter ID
 *     responses:
 *       200:
 *         description: EduCenter deleted successfully
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", roleMiddleware(["ceo", "admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role != "admin") {
      const one = await EduCenter.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!one) {
        loger.log("info", `This edue center not ceo`);
        return res.status(403).send({ message: "This not your edu center" });
      }

      const eduCenter = await EduCenter.findByPk(id);
      if (!eduCenter) {
        loger.log("info", `EduCenter with ID ${id} not found`);
        return res.status(404).send({ message: "EduCenter not found" });
      }

      await eduCentersSubject.destroy({
        where: { edu_id: id },
      });
      loger.log("info", `EduCenter deleted: ${id}`);
      await eduCenter.destroy();
      return res
        .status(200)
        .send({ message: "EduCenter deleted successfully" });
    }
    const eduCenter = await EduCenter.findByPk(id);
    if (!eduCenter) {
      loger.log("info", `EduCenter with ID ${id} not found`);
      return res.status(404).send({ message: "EduCenter not found" });
    }
    loger.log("info", `EduCenter deleted: ${id}`);
    await eduCenter.destroy();
    res.status(200).send({ message: "EduCenter deleted successfully" });
  } catch (error) {
    console.log(error);
    loger.log("error", "Error deleting EduCenter");
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
