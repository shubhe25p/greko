const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: process.env.PUBLIC_DOMAIN
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to NodeJS application." });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");

db.sequelize.sync();

require("./app/routes/auth.route")(app);
require("./app/routes/user.route")(app);

