const Chat = require("../models/Chat");
const getAIResponse = require("../utils/aiEngine");
const User = require("../models/User");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    // ✅ log INSIDE function
    console.log("USER:", req.user);

    const { message } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    
    const user = await User.findById(userId);

// 🟢 simple birth detail detection
if (
  !user.birthDetails?.dob &&
  message.includes("/") &&
  message.includes(":")
) {
  const parts = message.split(",");

  user.birthDetails = {
    dob: parts[0]?.trim(),
    time: parts[1]?.trim(),
    place: parts[2]?.trim(),
  };

  await user.save();

  return res.json({
    user: userMsg,
    ai: {
      message:
        "I have noted your birth details. Now tell me what problem you want guidance on.",
    },
  });
}
    // save user message
    const userMsg = await Chat.create({
      userId,
      role: "user",
      message,
    });

    // generate AI reply safely
    let aiReplyText = "Ara is silent for a moment.";

    try {
      aiReplyText = await getAIResponse(message);
    } catch (aiError) {
      console.error("🔥 AI ERROR:", aiError.message);
    }

    // save AI message (never undefined)
    const aiMsg = await Chat.create({
      userId,
      role: "ai",
      message: aiReplyText || "Ara is silent for a moment.",
    });

    res.json({
      user: userMsg,
      ai: aiMsg,
    });

  } catch (error) {
    console.error("🔥 CHAT CONTROLLER ERROR:", error);
    res.status(500).json({
      message: "Chat error",
      error: error.message,
    });
  }
};

// GET CHAT HISTORY
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const chats = await Chat.find({ userId }).sort({ createdAt: 1 });

    res.json(chats);

  } catch (error) {
    console.error("🔥 HISTORY ERROR:", error);
    res.status(500).json({
      message: "History error",
      error: error.message,
    });
  }
};
