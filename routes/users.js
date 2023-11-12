const express = require("express");
const router = express.Router();
const { Show, User } = require("../models/index");

router.get("/", async (req, res) => {
  const allUsers = await User.findAll();
  res.json(allUsers);
});

router.get("/:id", async (req, res) => {
  const theId = req.params.id;
  const theUser = await User.findByPk(theId);

  res.json(theUser);
});

router.get("/:id/shows", async (req, res) => {
  const theId = req.params.id;
  const theUser = await User.findByPk(theId, {
    include: [{ model: Show, through: "watched" }],
  });
  res.json(theUser);
});

module.exports = router;
