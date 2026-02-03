const Chat = require("../models/Chat");
const getAIResponse = require("../utils/aiEngine");
const User = require("../models/User");

// Last N messages to send to Gemini as context (user-specific, chronological)
const HISTORY_MESSAGE_LIMIT = 12;

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Optional: parse birth details from message if not already in profile (e.g. "DD/MM/YYYY, HH:MM, Place")
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

      // Save this turn to Chat so history stays consistent
      const userMsg = await Chat.create({ userId, role: "user", message });
      const aiReplyText =
        "I have noted your birth details. Now tell me what problem you want guidance on.";
      const aiMsg = await Chat.create({
        userId,
        role: "ai",
        message: aiReplyText,
      });
      return res.json({ user: userMsg, ai: aiMsg });
    }

    // Fetch last N messages for this user only (old → new) for AI context
    const recentChats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(HISTORY_MESSAGE_LIMIT)
      .lean();
    const history = recentChats.reverse().map((c) => ({ role: c.role, message: c.message }));

    // Save current user message
    const userMsg = await Chat.create({
      userId,
      role: "user",
      message,
    });

    // Generate AI reply with user-specific history + birth details
    let aiReplyText = "Ara is silent for a moment.";
    try {
      aiReplyText = await getAIResponse(message, {
        birthDetails: user.birthDetails || null,
        history,
      });
    } catch (aiError) {
      console.error("🔥 AI ERROR:", aiError.message);
    }

    // Save AI message
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
