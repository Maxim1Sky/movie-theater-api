const express = require("express");
const router = express.Router();
const { Show, User } = require("../models/index");
const Sequelize = require("sequelize");

router.get("/", async (req, res) => {
  const allShows = await Show.findAll();
  res.json(allShows);
});

router.get("/:id", async (req, res) => {
  const theId = req.params.id;
  const oneShow = await Show.findByPk(theId);
  res.json(oneShow);
});

router.get("/genre/:genre", async (req, res) => {
  const theGenre = req.params.genre
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  const theShows = await Show.findAll({ where: { genre: theGenre } });
  res.json(theShows);
});

// Update rating ?
router.put("/:id", async (req, res) => {
  const theId = await req.params.id;
  const newRating = req.body.rating;
  const theShow = Show.findByPk(theId);

  if (!theShow) {
    return res.status(404).json({ error: "Show not found" });
  }

  const result = await Show.update(
    { rating: newRating, watchedCount: Sequelize.literal("watchedCount + 1") },
    { where: { id: theId } }
  );
  res.json(result);
});

router.put("/status/:id", async (req, res) => {
  const theId = req.params.id;
  const status = req.body.available;
  const result = await Show.update(
    { available: status },
    { where: { id: theId } }
  );
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  const theId = req.params.id;
  const result = await Show.destroy({ where: { id: theId } });
  res.json(result);
});

module.exports = router;
