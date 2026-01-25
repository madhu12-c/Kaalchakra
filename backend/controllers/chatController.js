const Chat = require("../models/Chat");
const getAIResponse = require("../utils/aiEngine");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // save user message
    const userMsg = await Chat.create({
      userId,
      role: "user",
      message,
    });

    // generate AI reply
   const aiReplyText = await getAIResponse(message);


    // save AI message
    const aiMsg = await Chat.create({
      userId,
      role: "ai",
      message: aiReplyText,
    });

    res.json({
      user: userMsg,
      ai: aiMsg,
    });
  } catch (error) {
    res.status(500).json({ message: "Chat error" });
  }
};

// GET CHAT HISTORY
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({ userId }).sort({ createdAt: 1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "History error" });
  }
};
