/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: API for managing branches
 */

/**
 * @swagger
 * /branches/my-branches:
 *   get:
 *     summary: Get branches associated with the authenticated user
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of branches to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by creation date
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by branch name
 *       - in: query
 *         name: nameSort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by branch name
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: integer
 *         description: Filter by region ID
 *     responses:
 *       200:
 *         description: List of branches associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
 * /branches/all:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of branches to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by creation date
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by branch name
 *       - in: query
 *         name: nameSort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by branch name
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: integer
 *         description: Filter by region ID
 *     responses:
 *       200:
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
 * /branches/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Branch A"
 *               image:
 *                 type: string
 *                 example: "image"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               region_id:
 *                 type: integer
 *                 example: 1
 *               edu_id:
 *                 type: integer
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: "Chilonzor"
 *     responses:
 *       200:
 *         description: Branch created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Region or Education not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /branches/{id}:
 *   patch:
 *     summary: Update a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Branch A"
 *               image:
 *                 type: string
 *                 example: "image"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               region_id:
 *                 type: integer
 *                 example: 1
 *               edu_id:
 *                 type: integer
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: "Chilonzor"
 *     responses:
 *       200:
 *         description: Branch updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch or Region not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */

const express = require("express");
const { Branch, Region, EduCenter, User } = require("../associations");
const { Op } = require("sequelize");
const router = express.Router();
const {
  branchValidator,
  branchUpdateValidation,
} = require("../validators/branchValidation");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/auth-role.middlewars");

router.get("/my-branches", authMiddleware, async (req, res) => {
  try {
    let { limit, offset, createdAt, name, nameSort, regionId } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;
    const whereClause = { user_id: req.user.id };
    const order = [];

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (regionId) {
      whereClause.region_id = regionId;
    }

    if (createdAt) {
      order.push(["createdAt", createdAt === "asc" ? "ASC" : "DESC"]);
    }

    if (nameSort) {
      order.push(["name", nameSort === "asc" ? "ASC" : "DESC"]);
    }
    const totalCount = await Branch.count({ where: whereClause });

    const branches = await Branch.findAll({
      where: whereClause,
      limit,
      offset,
      order,
      include: [
        { model: Region, attributes: ["name"] },
        {
          model: EduCenter,
          as: "eduCenter",
          attributes: ["name", "region_id", "phone", "location"],
        },
        { model: User, as: "user", attributes: ["name"] },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;

    res.send({
      data: branches,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error-500: Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    let { limit, offset, createdAt, name, nameSort, regionId } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;
    const whereClause = {};
    const order = [];

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (regionId) {
      whereClause.region_id = regionId;
    }

    if (createdAt) {
      order.push(["createdAt", createdAt === "asc" ? "ASC" : "DESC"]);
    }

    if (nameSort) {
      order.push(["name", nameSort === "asc" ? "ASC" : "DESC"]);
    }
    const totalCount = await Branch.count({ where: whereClause });

    const branches = await Branch.findAll({
      where: whereClause,
      limit,
      offset,
      order,
      include: [
        { model: Region, attributes: ["name"] },
        {
          model: EduCenter,
          as: "eduCenter",
          attributes: ["name", "region_id", "phone", "location"],
        },
        { model: User, as: "user", attributes: ["name"] },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;

    res.send({
      data: branches,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error-500: Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [
        { model: Region, attributes: ["name"] },
        {
          model: EduCenter,
          as: "eduCenter",
          attributes: ["name", "region_id", "phone", "location"],
        },
        { model: User, as: "user", attributes: ["name"] },
      ],
    });

    if (!branch) {
      return res.status(404).send({ messge: "Branch not found" });
    }
    res.send(branch);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/", roleMiddleware(["admin", "ceo"]), async (req, res) => {
  try {
    const { error } = branchValidator.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const bazaRegion = await Region.findByPk(req.body.region_id);
    if (!bazaRegion) {
      return res.status(404).send({ message: "Not found region" });
    }

    const bazaEdu = await EduCenter.findByPk(req.body.edu_id);
    if (!bazaEdu) {
      return res.status(404).send({ message: "Not found Education" });
    }

    const branchName = await Branch.findOne({ where: { name: req.body.name } });
    if (branchName) {
      return res
        .status(400)
        .send({ message: "This Branch already exists please change name" });
    }

    const branchPhone = await Branch.findOne({
      where: { phone: req.body.phone },
    });
    if (branchPhone) {
      return res.status(400).send({
        message: "This Branch already exists please change phone number",
      });
    }

    const branch = await Branch.create({
      name: req.body.name,
      image: req.body.image || "No image",
      phone: req.body.phone,
      region_id: req.body.region_id,
      edu_id: req.body.edu_id,
      address: req.body.address,
      user_id: req.user.id,
    });
    console.log(branch);

    res.send(branch);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.patch("/:id", roleMiddleware(["admin", "ceo"]), async (req, res) => {
  try {
    let one;
    if (req.user.role !== "admin") {
      one = await Branch.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!one) {
        return res.status(403).send({ message: "Forbidden" });
      }
    } else {
      one = await Branch.findByPk(req.params.id);
      if (!one) {
        return res.status(404).send({ message: "Branch not found" });
      }
    }

    const { error } = branchUpdateValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    if (req.body.region_id !== undefined) {
      if (req.body.region_id === 0) {
        return res.status(400).send({ message: "Invalid region_id value" });
      }
      const bazaReg = await Region.findByPk(req.body.region_id);
      if (!bazaReg) {
        return res.status(404).send({ message: "Region not found" });
      }
    }

    if (req.body.edu_id !== undefined) {
      if (req.body.edu_id === 0) {
        return res.status(400).send({ message: "Invalid edu_id value" });
      }
      const bazaEdu = await EduCenter.findByPk(req.body.edu_id);
      if (!bazaEdu) {
        return res.status(404).send({ message: "Education center not found" });
      }
    }
    await one.update(req.body);
    res.send(one);
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).send({ message: "Server error" });
  }
});

router.delete("/:id", roleMiddleware(["admin", "ceo"]), async (req, res) => {
  try {
    if (req.user.role != "admin") {
      const one = await Branch.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!one) {
        return res.status(403).send({ message: "Forbidden" });
      }
      await one.destroy();
      return res.send({ message: "Branch deleted" });
    }
    const one = await Branch.findByPk(req.params.id);
    if (!one) {
      return res.status(404).send({ message: "Not found" });
    }
    await one.destroy();
    res.send(one.dataValues);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
