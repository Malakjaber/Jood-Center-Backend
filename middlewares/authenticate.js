const { session } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const sessionId = req.headers.authorization;

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Session ID not provided" });
    }

    const oldSession = await session.findOne({
      where: { sid: sessionId },
    });

    if (!oldSession) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = authenticate;
