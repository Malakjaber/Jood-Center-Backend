const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRoutes = require("./routes/users.js");

const PORT = process.env.PORT;
const app = express();
// require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

async function startListening() {
  try {
    await db.sequelize.authenticate();
    //     console.log("Connection has been established successfully.");
    await db.sequelize.sync({ force: true }).then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`);
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startListening();
