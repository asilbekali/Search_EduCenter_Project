/**
 * @swagger
 * tags:
 *   name: CourseRegistration
 *   description: API endpoints for managing course registrations
 */

/**
 * @swagger
 * /registration/my-registrations:
 *   get:
 *     summary: Get the current user's course registrations
 *     tags: [CourseRegistration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *       - in: query
 *         name: branch_id
 *         schema:
 *           type: string
 *         description: Filter by branch ID
 *     responses:
 *       200:
 *         description: List of course registrations
 *       404:
 *         description: No registrations found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /registration/all:
 *   get:
 *     summary: Get all course registrations (Admin only)
 *     tags: [CourseRegistration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *       - in: query
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by education ID
 *       - in: query
 *         name: branch_id
 *         schema:
 *           type: string
 *         description: Filter by branch ID
 *     responses:
 *       200:
 *         description: List of course registrations
 *       404:
 *         description: No registrations found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /registration/:
 *   post:
 *     summary: Create a new course registration
 *     tags: [CourseRegistration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - branch_id
 *     responses:
 *       200:
 *         description: Registration created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /registration/{id}:
 *   patch:
 *     summary: Update a course registration
 *     tags: [CourseRegistration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Registration updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /registration/{id}:
 *   delete:
 *     summary: Delete a course registration
 *     tags: [CourseRegistration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Registration deleted successfully
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Internal server error
 */
const router = require("express").Router();
const logger = require("../logger");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/auth-role.middlewars");
const {
  courseRegistration,
  User,
  Branch,
  EduCenter,
} = require("../associations");
const {
  courseRegistrationValidator,
  courseRegistrationValidatorPatch,
} = require("../validators/courseregistration.validator");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

router.get("/my-registrations", authMiddleware, async (req, res) => {
  try {
    let { limit, offset, branch_id } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    let whereCondition = { user_id: req.user.id };

    if (branch_id) {
      whereCondition.branch_id = branch_id;
    }
    const totalCount = await courseRegistration.count({
      where: whereCondition,
    });

    const registrations = await courseRegistration.findAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        { model: User, attributes: ["name", "email"] },
        {
          model: Branch,
          as: "branch",
          attributes: ["name", "address", "region_id", "phone"],
          include: [
            {
              model: EduCenter,
              as: "eduCenter",
              attributes: ["name", "location", "region_id", "phone"],
            },
          ],
        },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;

    if (!registrations) {
      return res
        .status(404)
        .send({ message: "You have not registered any course yet" });
    }
    logger.log({
      level: "info",
      message: `User ${req.user.id} fetched his registrations`,
    });
    res.send({
      data: registrations,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.log(error);
    logger.error("Error to get my registration");
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/all", roleMiddleware(["admin"]), async (req, res) => {
  try {
    let { limit, offset, edu_id, branch_id } = req.query;
    limit = parseInt(limit) || 10;
    offset = (parseInt(offset) - 1) * limit || 0;

    if (edu_id) {
      const bazaEdu = await EduCenter.findByPk(edu_id);

      if (!bazaEdu) {
        return res.status(404).send({ message: "Education Center not found" });
      }
    }

    let whereCondition = {};

    if (branch_id) {
      whereCondition.branch_id = branch_id;
    }
    const totalCount = await courseRegistration.count({
      where: whereCondition,
    });

    const registrations = await courseRegistration.findAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        { model: User, attributes: ["name", "email"] },
        {
          model: Branch,
          as: "branch",
          attributes: ["name", "address", "region_id", "phone"],
          include: [
            {
              model: EduCenter,
              as: "eduCenter",
              attributes: ["name", "location", "region_id", "phone"],
            },
          ],
        },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = offset / limit + 1;

    if (!registrations.length) {
      return res.status(404).send({ message: "There is no registration yet" });
    }
    logger.log({
      level: "info",
      message: `User ${req.user.id} fetched his registrations`,
    });
    res.send({
      data: registrations,
      totalCount,
      totalPages,
      currentPage,
      limit,
    });
  } catch (error) {
    console.log(error);
    logger.error("Error to get registrations");
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    // Kursga yozilish ma'lumotlarini tekshirish
    const { error } = courseRegistrationValidator.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findByPk(req.user.id);
    const branch = await Branch.findByPk(req.body.branch_id);
    if (!branch) {
      logger.log("info", "Register course in branch not found");
      return res.status(404).send({ message: "Branch not found !" });
    }
    const branchCeo = await User.findByPk(branch.user_id);
    const registration = await courseRegistration.create({
      ...req.body,
      user_id: req.user.id,
    });

    logger.log({
      level: "info",
      message: `User ${req.user.id} posted new registration`,
    });

    // Shartnoma PDF faylini yaratish
    const pdfFileName = `receipt_${registration.id}.pdf`;
    const pdfPath = path.join(process.cwd(), "uploads", pdfFileName);

    // uploads papkasini tekshirib, mavjud bo'lmasa yaratish
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads", { recursive: true });
    }

    // PDF hujjatini yaratish
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc
      .fontSize(18)
      .text("O'QUV MARKAZI BILAN O'QUVCHI O'RTASIDAGI SHARTNOMA", {
        align: "center",
      });
    doc.moveDown();

    doc.fontSize(12).text("1. SHARTNOMA TOMONLARI");
    doc.text(
      `Mazkur shartnoma (keyingi o‘rinlarda "Shartnoma" deb yuritiladi) quyidagi tomonlar o‘rtasida tuzildi:`
    );
    doc.text(`1.1. O‘quv markazi: ${branch.name}, telefon:  ${branch.phone}`);
    doc.text(`1.2. O‘quvchi: ${user.name}, telefon: ${user.phone}`);
    doc.moveDown();

    doc.text("2. SHARTNOMA MAVZUSI");
    doc.text(
      `2.1. Ushbu shartnomaga asosan, Markaz O‘quvchiga  kursini o‘qitishni majburiyatiga oladi, O‘quvchi esa belgilangan tartibda o‘quv to‘lovini amalga oshiradi.`
    );
    doc.text("2.2. Kurs muddati: 1 yil.");
    doc.text(
      "2.3. Dars jadvali: Haftasiga 5 kun, har bir dars davomiyligi 5 soat."
    );
    doc.moveDown();

    doc.text("3. TOMONLARNING HUQUQ VA MAJBURIYATLARI");
    doc.text("3.1. Markazning majburiyatlari:");
    doc.text("  - O‘quvchini belgilangan dastur bo‘yicha o‘qitish;");
    doc.text(
      "  - Malakali o‘qituvchilar tomonidan ta’lim berilishini ta’minlash;"
    );
    doc.text("  - O‘quvchiga zarur o‘quv materiallarini taqdim etish;");
    doc.text(
      "  - Kursni muvaffaqiyatli tugatgan O‘quvchiga sertifikat berish."
    );
    doc.text("3.2. O‘quvchining majburiyatlari:");
    doc.text(
      "  - Darslarga muntazam qatnashish va belgilangan intizom qoidalariga rioya qilish;"
    );
    doc.text("  - O‘quv markazining ichki tartib-qoidalariga amal qilish;");
    doc.text("  - O‘quv kursining to‘lovini o‘z vaqtida amalga oshirish;");
    doc.text(
      "  - O‘quv markazi mulkiga ehtiyotkorlik bilan munosabatda bo‘lish."
    );
    doc.moveDown();

    doc.text("4. TO‘LOV SHARTLARI");
    doc.text(`4.1. Kurs narxi: 2.200.000 so‘m.`);
    doc.text("4.2. To‘lov quyidagi shakllardan biri orqali amalga oshiriladi:");
    doc.text("  - Naqd pul");
    doc.text("  - Bank o‘tkazmasi");
    doc.text("  - Elektron to‘lov tizimlari orqali");
    doc.text("4.3. To‘lov tartibi:");
    doc.text(
      "  - To‘lov to‘liq yoki bosqichma-bosqich amalga oshirilishi mumkin."
    );
    doc.text(
      "  - Bosqichma-bosqich to‘lov holatida har oyning 1-sanasida kamida 2.200.000 so‘m to‘lanishi shart."
    );
    doc.text(
      "  - To‘lov kechiktirilgan taqdirda 5 kunga qadar jarima qo‘llanilmaydi, 5 kundan ortsa 100.000 miqdorda jarima belgilanadi."
    );
    doc.moveDown();
    doc.text("5. SHARTNOMANI BEKOR QILISH SHARTLARI");
    doc.text(
      "5.1. Tomonlarning kelishuviga binoan shartnoma bekor qilinishi mumkin."
    );
    doc.text("5.2. To‘lov qaytarilishi shartlari:");
    doc.text("  - Agar kurs boshlanmagan bo‘lsa – to‘lov to‘liq qaytariladi.");
    doc.text(
      "  - Kurs boshlangan bo‘lsa, to‘lov qaytarilmaydi, faqat boshqa kursga o‘tkazish imkoniyati mavjud."
    );
    doc.moveDown();
    doc.text("6. NIZOLARNI HAL QILISH");
    doc.text(
      "6.1. Ushbu shartnoma bo‘yicha kelib chiqadigan nizolar tomonlarning o‘zaro kelishuvi orqali hal qilinadi. Kelishuvga erishilmagan taqdirda, nizolar amaldagi qonunchilikka muvofiq sud orqali hal qilinadi."
    );
    doc.moveDown();

    doc.text("7. SHARTNOMANING AMAL QILISH MUDDATI");
    doc.text(
      "7.1. Shartnoma imzolangan kundan boshlab kuchga kiradi va kurs muddati tugaguniga qadar amal qiladi."
    );
    doc.moveDown();

    doc.text("8. QO‘SHIMCHA SHARTLAR");
    doc.text(
      "8.1. Kursni muvaffaqiyatli tamomlagan O‘quvchi maxsus sertifikat yoki diplom bilan taqdirlanadi."
    );
    doc.text(
      "8.2. O‘quvchi darslarni 20% dan ortiq qoldirsa, yakuniy sertifikat berilmasligi mumkin."
    );
    doc.text(
      "8.3. O‘quvchi va Markaz o‘rtasida yuzaga kelishi mumkin bo‘lgan boshqa kelishmovchiliklar ushbu shartnoma asosida hal etiladi."
    );
    doc.moveDown();

    doc.text("TOMONLARNING IMZOLARI");
    doc.text(
      `O‘quv markazi nomidan: F.I.Sh: ${
        branchCeo.name
      }  Sana: ${new Date().toLocaleDateString()}`
    );
    doc.text(
      `O‘quvchi: ${user.name}, telefon: ${
        user.phone
      } Sana: ${new Date().toLocaleDateString()}`
    );

    doc.end();

    stream.on("finish", () => {
      if (!fs.existsSync(pdfPath)) {
        console.error("❌ PDF yaratilmadi:", pdfPath);
        return res.status(500).json({ message: "PDF yaratishda xatolik!" });
      }

      res.download(pdfPath, pdfFileName, (err) => {
        if (err) {
          console.error("❌ PDF yuklashda xatolik:", err);
          return res
            .status(500)
            .json({ message: "PDF yuklab olishda xatolik!" });
        }

        // Yuklab olingandan so'ng PDF faylini o'chirish
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.log(error);
    logger.error("Error to post registration");
    res.status(500).send({ message: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { error } = courseRegistrationValidatorPatch.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const registration = await courseRegistration.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!registration) {
      return res.status(404).send({ message: "Registration not found" });
    }

    const bazaBranch = await Branch.findByPk(req.body.branch_id);
    if (!bazaBranch) {
      logger.log("info", "Register course in branch not found");
      return res.status(404).send({ message: "Branch not found !" });
    }

    await registration.update(req.body);
    logger.log({
      level: "info",
      message: "Admin patched registration",
    });

    res.send(registration);
  } catch (error) {
    console.log(error);
    logger.error("Error to patch registration");
    res.status(500).send({ message: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const registration = await courseRegistration.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!registration) {
      return res.status(404).send({ message: "Registration not found" });
    }
    await registration.destroy();
    logger.log("info", "Admin deleted registration");
    res.send(registration.dataValues);
  } catch (error) {
    console.log(error);
    logger.error("Error to delete registration");
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
