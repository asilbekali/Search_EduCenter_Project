/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *         - phone
 *         - region_id
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           description: User's full name
 *           example: John Doe
 *         phone:
 *           type: string
 *           description: User's phone number
 *           example: "+998901234567"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: johndoe@gmail.com
 *         region_id:
 *           type: integer
 *           description: User's region ID
 *           example: 1
 *         role:
 *           type: string
 *           description: User's role
 *           example: user
 *         status:
 *           type: string
 *           description: Account status
 *           example: active
 *         image:
 *           type: string
 *           description: User's profile image URL
 *           example: https://example.com/profile.jpg
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
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - phone
 *               - name
 *               - region_id
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: +998901234567
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: password123
 *               region_id:
 *                 type: integer
 *                 description: User's region ID
 *                 example: 1
 *               role:
 *                 type: string
 *                 description: User's role
 *                 example: user
 *               image:
 *                 type: string
 *                 description: User's image
 *                 example: image
 *     responses:
 *       200:
 *         description: OTP sent to the user's email
 *       400:
 *         description: Validation error or SMS sending error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify a user's account using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: johndoe@gmail.com
 *               otp:
 *                 type: string
 *                 description: One-time password sent to the user's email
 *                 example: 12345
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: johndoe@gmail.com
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: +998901234567
 *     responses:
 *       200:
 *         description: OTP sent to the user's email
 *       404:
 *         description: User not found
 *       400:
 *         description: Error sending SMS code
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: User not found
 *       401:
 *         description: Incorrect password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/access-token:
 *   post:
 *     summary: Generate a new access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   patch:
 *     summary: Reset user password
 *     description: Allows authenticated users to reset their password by providing the old password and a new one.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password successfully reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password successfully reset"
 *       401:
 *         description: Unauthorized - Invalid old password or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Old password is incorrect"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get authenticated user information
 *     description: Retrieve the details of the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const userValidator = require("../validators/user.validator");
const { totp } = require("otplib");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const sendEmail = require("../config/sendEmail");
const { authMiddleware } = require("../middlewares/auth-role.middlewars");
const sendSMS = require("../config/eskiz");
const Session = require("../models/session");
const DeviceDetector = require("device-detector-js");
const resetPasswordValidator = require("../validators/reset-password.validator");
const { Region, User } = require("../associations");
const deviceDetector = new DeviceDetector();

const router = require("express").Router();

function genToken(user) {
  const token = jwt.sign(
    { id: user.id, role: user.role, status: user.status },
    "apex1",
    { expiresIn: "40m" }
  );
  return token;
}

function genRefreshToken(user) {
  const token = jwt.sign({ id: user.id }, "apex2", { expiresIn: "14d" });
  return token;
}

router.post("/register", async (req, res) => {
  try {
    const { error } = userValidator.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { email, password, phone, name, region_id, ...rest } = req.body;
    const user_email = await User.findOne({ where: { email } });
    const user_phone = await User.findOne({ where: { phone } });
    const regionBaza = await Region.findOne({ where: { id: region_id } });
    if (!regionBaza) {
      return res.status(404).send({ message: "Region not found" });
    }

    if (user_email || user_phone) {
      return res.status(400).send({ message: "User already exists" });
    }
    const otp = totp.generate(email + "apex");
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      email,
      password: hash,
      status: "pending",
      phone: phone,
      name,
      region_id: regionBaza.id,
      ...rest,
    });
    console.log(otp);
    // const err = await sendSMS(phone, otp);
    // if (err)
    //   return res
    //     .status(400)
    //     .send({
    //       message: "Error to send SMS code please enter a valid phone number",
    //     });
    sendEmail(email, name, otp);

    logger.log("info", `New user registered - ${email}`);
    res.send({ message: "Otp sended to your email" });
  } catch (error) {
    console.log(error);
    logger.error("Error to register user");
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const match = totp.verify({ token: otp, secret: email + "apex" });
    if (!match) {
      return res.status(400).send({ message: "Code is not valid or expired" });
    }

    await user.update({
      status: "active",
    });

    logger.log("info", `User verified - ${user}`);
    res.send({ message: "Verified" });
  } catch (error) {
    console.log(error);
    logger.error("Error to verify user");
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user_email = await User.findOne({ where: { email } });
    const user_phone = await User.findOne({ where: { phone } });
    if (!user_email || !user_phone) {
      return res.status(404).send({ message: "Not found" });
    }
    const otp = totp.generate(email + "apex");
    console.log(otp);
    // const err = await sendSMS(phone, otp);
    // if (err)
    //   return res
    //     .status(400)
    //     .send({
    //       message: "Error to send SMS code please enter a valid phone number",
    //     });
    sendEmail(email, "New User", otp);
    res.send({ message: "Otp sended to your email" });
  } catch (error) {
    console.log(error);
    logger.error("Error to resend otp to user");
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(401).send({ message: "Password is incorrect" });
    }
    if (user.status == "pending") {
      return res.status(400).send({
        message: "Your account is not verified please verify",
      });
    }
    const access_token = genToken(user);
    const refresh_token = genRefreshToken(user.email);

    logger.log("info", `User logged in - ${user}`);

    const device = deviceDetector.parse(req.headers["user-agent"]);
    console.log(device);

    const session = await Session.findOne({
      where: { user_id: user.id, ip: req.ip },
    });
    if (!session) {
      await Session.create({
        user_id: user.id,
        ip: req.ip,
        device:
          device.os.name +
          " " +
          device.os.version +
          " " +
          device.device.type +
          " " +
          device.device.name +
          " " +
          device.device.brand,
      });
    }
    res.send({ refresh_token, access_token });
  } catch (error) {
    console.log(error);
    logger.error("Error to log in");
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/access-token", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const user = jwt.verify(refresh_token, "apex2");

    if (!user)
      return res.status(401).send({ message: "Invalid refresh token" });

    logger.log("info", `User got new access_token - ${user.email}`);
    const access_token = genToken(user);
    res.send({ access_token });
  } catch (error) {
    console.log(error);
    logger.error("Error to get new access_token");
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.patch("/reset-password", authMiddleware, async (req, res) => {
  try {
    const { error } = resetPasswordValidator.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(401).send({ message: "Old password is incorrect" });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    await user.update({ password: hash });
    res.send({ message: "Password successfully reset" });
  } catch (error) {
    console.log(error);
    logger.error("Error to reset user's password:");
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: { model: Region, attributes: ["name"] },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    logger.error("Error retrieving user information:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
