/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page offset for pagination
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
 *         description: Filter by name
 *       - in: query
 *         name: nameSort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filter by phone
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/byregion/{id}:
 *   get:
 *     summary: Retrieve users by region
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page offset for pagination
 *     responses:
 *       200:
 *         description: List of users in the region
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               password:
 *                 type: string
 *                 example: password123
 *               region_id:
 *                 type: integer
 *                 example: 1
 *               role:
 *                 type: string
 *                 example: user
 *               image:
 *                 type: string
 *                 example: image
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - region_id
 *               - role
 *               - image
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               region_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

const router = require("express").Router();
const logger = require("../logger");
const { roleMiddleware } = require("../middlewares/auth-role.middlewars");
const bcrypt = require("bcrypt");
const userValidator = require("../validators/user.validator");
const { Op } = require("sequelize");
const { Region, User } = require("../associations");

router.get("/all", roleMiddleware(["admin"]), async (req, res) => {
  try {
    let { limit, offset, createdAt, name, nameSort, email, phone } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    const whereClause = {};
    const order = [];

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }

    if (phone) {
      whereClause.phone = { [Op.like]: `%${phone}%` };
    }

    if (createdAt) {
      order.push(["createdAt", createdAt === "asc" ? "ASC" : "DESC"]);
    }

    if (nameSort) {
      order.push(["name", nameSort === "asc" ? "ASC" : "DESC"]);
    }
    const totalCount = await User.count({ where: whereClause });
    const all = await User.findAll({
      where: whereClause,
      limit,
      offset,
      order,
      include: { model: Region, attributes: ["name"] },
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
    console.error(error);
    res.status(500).send({ message: "Error in getting users" });
    logger.error("Error in getting users", { error });
  }
});

router.get("/byregion/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    let { limit, offset } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    const totalCount = await User.count();

    const users = await User.findAll({
      where: { region_id: req.params.id },
      limit,
      offset,
    });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;
    if (!users.length) {
      return res.status(404).send({ message: "Users not found" });
    }

    logger.info("Admin fetched users by region", { regionId: req.params.id });
    res.send({
      data: users,
      totalCount,
      totalPages,
      currentPage,
      limit,
      include: { model: Region, attributes: ["name"] },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in getting users by region" });
    logger.error("Error in getting users by region", { error });
  }
});

router.post("/", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { error } = userValidator.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { password, email, phone, region_id, ...rest } = req.body;

    const existingUserByEmail = await User.findOne({ where: { email } });
    const existingUserByPhone = await User.findOne({ where: { phone } });

    const regionBaza = await Region.findOne({ where: { id: region_id } });
    if (!regionBaza) {
      return res.status(404).send({ message: "Region not found" });
    }

    if (existingUserByEmail || existingUserByPhone) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hash = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      email,
      phone,
      password: hash,
      region_id: region_id,
      ...rest,
      status: "active",
    });

    logger.info("Admin created a new user");
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in creating user" });
    logger.error("Error in creating user", { error });
  }
});

router.patch("/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.update(req.body);
    logger.info("Admin updated a user", { userId: req.params.id });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in updating user" });
    logger.error("Error in updating user", { error });
  }
});

router.delete("/:id", roleMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.destroy();
    logger.info("Admin deleted a user", { userId: req.params.id });
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in deleting user" });
    logger.error("Error in deleting user", { error });
  }
});

/**
 * @swagger
 * /users/add-admin:
 *   post:
 *     summary: Promote a user to admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: User promoted to admin successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Unauthorized to perform this action
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add-admin",
  roleMiddleware(["admin", "ceo"]),
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found " });
      }

      await user.update({ role: "admin" });

      logger.info("User promoted to admin", { userId });
      res.status(200).send({ message: "User promoted to admin successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error in promoting user to admin" });
      logger.error("Error in promoting user to admin", { error });
    }
  }
);

/**
 * @swagger
 * /users/create-admin:
 *   post:
 *     summary: Create a new admin user
 *     tags: [Users]
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
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               password:
 *                 type: string
 *                 example: admin123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation error or admin already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create-admin",
  roleMiddleware(["admin", "ceo"]),
  async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;

      if (!name || !email || !phone || !password || !role) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const existingUserByEmail = await User.findOne({ where: { email } });
      const existingUserByPhone = await User.findOne({ where: { phone } });

      if (existingUserByEmail || existingUserByPhone) {
        return res.status(400).send({ message: "Admin already exists" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newAdmin = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        region_id: 1,
        status: "active",
        image: "No image",
      });

      logger.info("New admin created", { adminId: newAdmin.id });
      res
        .status(201)
        .send({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error in creating admin" });
      logger.error("Error in creating admin", { error });
    }
  }
);

module.exports = router;
