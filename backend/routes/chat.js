const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { sendMessage, getHistory } = require("../controllers/chatController");

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/history", authMiddleware, getHistory);

module.exports = router;
