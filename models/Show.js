//import our db, Model, DataTypes
const { db, DataTypes } = require("../db/connection");

//Creating a User child class from the Model parent class
const Show = db.define("shows", {
  title: DataTypes.STRING,
  genre: DataTypes.STRING,
  rating: DataTypes.INTEGER,
  available: DataTypes.BOOLEAN,
  watchedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
});

//exports
module.exports = Show;
