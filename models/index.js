const Show = require("./Show");
const User = require("./User");
const seed = require("../db/seed");

User.belongsToMany(Show, { through: "watched" });
Show.belongsToMany(User, { through: "watched" });
//User.belongsToMany(Show, { through: "watched" });

async function main() {
  await seed();
}
main();

module.exports = {
  Show,
  User,
};
