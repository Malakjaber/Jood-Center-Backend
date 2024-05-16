const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRoutes = require("./routes/users.js");
const studentsRoutes = require("./routes/students.js");
const classesRoutes = require("./routes/classes.js");
const reportsRoutes = require("./routes/reports.js");
const teacherClassRoutes = require("./routes/teacher-class.js");
const teacherRoutes = require("./routes/teachers.js");
const coManagersRoutes = require("./routes/coManagers.js");

const fakerRoutes = require("./routes/faker.js");

const PORT = process.env.PORT;
const app = express();
// require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", usersRoutes);
app.use("/students", studentsRoutes);
app.use("/classes", classesRoutes);
app.use("/reports", reportsRoutes);
app.use("/teacher-class", teacherClassRoutes);
app.use("/teachers", teacherRoutes);
app.use("/co_managers", coManagersRoutes);

app.use("/fake", fakerRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

async function startListening() {
  try {
    await db.sequelize.authenticate();
    //     console.log("Connection has been established successfully.");
    await db.sequelize.sync({ force: false }).then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`);
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startListening();
