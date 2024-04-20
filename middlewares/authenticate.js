const { sessions } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const sessionId = req.headers.authorization;

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Session ID not provided" });
    }

    const session = await sessions.findOne({
      where: { sid: sessionId },
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = authenticate;
