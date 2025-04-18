const express = require("express");
const { connectDb } = require("./config/db");
const authRoutes = require("./routes/auth");
const regionRoutes = require("./routes/region");
const userRoutes = require("./routes/users");
const sessionRoutes = require("./routes/sessions");
const registrationRoutes = require("./routes/courseRegistration");
const filedRoutes = require("./routes/fileds");
const uploadRoutes = require("./routes/upload");
const categoryRoutes = require("./routes/category");
const EduCenterRoutes = require("./routes/eduCenter");
const SubjectRoutes = require("./routes/subject");
const branchRoutes = require("./routes/branchRoutes");
const commentRoutes = require("./routes/comment");
const excelRoutes = require("./routes/excel");
const resourceRoutes = require("./routes/resources");
const likeRoutes = require("./routes/likes");
const cors = require("cors");
const setupSwagger = require("./swagger");
const app = express();
connectDb();

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/auth", authRoutes);
app.use("/region", regionRoutes);
app.use("/users", userRoutes);
app.use("/registration", registrationRoutes);
app.use("/fields", filedRoutes);
app.use("/upload", uploadRoutes);
app.use("/categories", categoryRoutes);
app.use("/eduCenter", EduCenterRoutes);
app.use("/subject", SubjectRoutes);
app.use("/branches", branchRoutes);
app.use("/comments", commentRoutes);
app.use("/excel-users", excelRoutes);
app.use("/resources", resourceRoutes);
app.use("/likes", likeRoutes);
app.use(sessionRoutes);
setupSwagger(app);

app.listen(5000, () => console.log("server is running on 5000"));
