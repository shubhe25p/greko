const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.thing = require("../models/thing.model")(sequelize, Sequelize);
db.tag = require("../models/tag.model")(sequelize, Sequelize);

const User = db.user;
const Thing = db.thing;
const Tag = db.tag;

User.belongsToMany(Thing, {through: 'users_things'});
Thing.belongsToMany(User, {through: 'users_things'});
Thing.belongsTo(Tag);

module.exports = db;