const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user.userId,
  });
});

module.exports = router;
