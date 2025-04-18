const ExcelJS = require("exceljs");
const path = require("path");
const User = require("../models/user");
const fs = require("fs");

// Foydalanuvchilarni olish va Excel faylini yaratish funksiyasi
const generateUserFile = async () => {
  try {
    // Barcha foydalanuvchilarni olish
    const users = await User.findAll();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 30 },
      { header: "Status", key: "status", width: 30 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    });

    const filePath = path.join("uploads", Math.random() + "users.xlsx");
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    throw new Error("Fayl yaratishda xatolik yuz berdi");
  }
};

module.exports = generateUserFile;
