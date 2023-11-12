const express = require("express");
const router = express.Router();
const { Show, User } = require("../models/index");
const Sequelize = require("sequelize");
const { body, validationResult } = require("express-validator");
const { validateHeaderValue } = require("http");

const statusCheck = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status cannot be empty")
    .isLength({ min: 5, max: 25 })
    .withMessage("Status must be between 5 and 25 characters"),
];

const ratingCheck = [
  body("rating")
    .trim()
    .notEmpty()
    .withMessage("Rating cannot be empty")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 1, max: 10 })
    .withMessage("Rating must be between 1 and 10"),
];

router.get("/", async (req, res) => {
  const allShows = await Show.findAll();
  res.json(allShows);
});

router.get("/:id", async (req, res) => {
  const theId = req.params.id;
  const oneShow = await Show.findByPk(theId);
  res.json(oneShow);
});

// Get all shows by Genre
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
router.put("/:id", ratingCheck, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ error: errors.array() });
  } else {
    const theId = await req.params.id;
    const newRating = req.body.rating;
    const theShow = Show.findByPk(theId);

    if (!theShow) {
      return res.status(404).json({ error: "Show not found" });
    }

    const result = await Show.update(
      {
        rating: newRating,
        watchedCount: Sequelize.literal("watchedCount + 1"),
      },
      { where: { id: theId } }
    );
    res.json(result);
  }
});

// Update show status
router.put("/status/:id", statusCheck, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ error: errors.array() });
  } else {
    const theId = req.params.id;
    const status = req.body.status;
    const result = await Show.update(
      { available: status },
      { where: { id: theId } }
    );
    res.json(result);
  }
});

router.delete("/:id", async (req, res) => {
  const theId = req.params.id;
  const result = await Show.destroy({ where: { id: theId } });
  res.json(result);
});

module.exports = router;
