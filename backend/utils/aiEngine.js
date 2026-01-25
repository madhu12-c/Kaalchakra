const getAIResponse = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("career")) {
    return "Your career path is influenced by Saturn. Patience and discipline will bring success.";
  }

  if (msg.includes("love")) {
    return "Venus is guiding your love life. Honest communication will deepen bonds.";
  }

  if (msg.includes("money") || msg.includes("finance")) {
    return "Jupiter suggests steady financial growth. Avoid impulsive decisions.";
  }

  if (msg.includes("health")) {
    return "Mars advises you to balance energy with rest. Health improves with routine.";
  }

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Greetings, seeker. The cosmos is listening 🪐";
  }

  return "The planets are aligning. Ask with clarity, and the universe shall respond.";
};

module.exports = getAIResponse;
