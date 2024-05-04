const { teacher, parent, manager, co_manager, session } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    let role = req.query.role;

    if (!role) {
      return res.status(400).json({ message: "You should select a role" });
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 9;
    }

    const search = req.query.search;
    let conditions = {};

    if (search) {
      search = search.toString();
      conditions.username = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const users = [];

    switch (role) {
      case "parent":
        users = await parent.findAll({
          where: conditions,
          order: [["parent_id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      case "teacher":
        users = await teacher.findAll({
          where: conditions,
          order: [["teacher_id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      case "manager":
        users = await manager.findAll({
          where: conditions,
          order: [["id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      case "co_manager":
        users = await co_manager.findAll({
          where: conditions,
          order: [["id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      default:
        break;
    }

    return res.status(200).json({ message: "success", users: users });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.query.role;

    if (Number.isNaN(id)) {
      return res.status(400);
    }
    let userProfile = {};
    switch (role) {
      case "parent":
        userProfile = await parent.findByPk(id);
        break;
      case "teacher":
        userProfile = await teacher.findByPk(id);
        break;
      case "co_manager":
        userProfile = await co_manager.findByPk(id);
        break;
      case "manager":
        userProfile = await manager.findByPk(id);
        break;
      default:
        res.status(400).json({ error: "Bad request" });
        break;
    }

    return res.status(200).json({ message: "success", user: userProfile });
  } catch (error) {
    return res.status(500);
  }
};

const signUp = async (req, res) => {
  try {
    const { username, id, email, password, role } = req.body;

    if (!id && role === "parent") {
      return res.status(400).json({ error: "Parent ID is required" });
    }

    if (
      (await parent.findOne({ where: { email } })) ||
      (await teacher.findOne({ where: { email } })) ||
      (await co_manager.findOne({ where: { email } })) ||
      (await manager.findOne({ where: { email } }))
    ) {
      return res.status(400).json({ error: "Email is already used before" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = {};
    let newUserId = uuidv4();
    const userData = {
      username,
      password: hashedPassword,
      email,
    };
    switch (role) {
      case "parent":
        newUser = await parent.create({
          parent_id: id,
          ...userData,
        });
        break;
      case "teacher":
        newUser = await teacher.create({
          teacher_id: newUserId,
          ...userData,
        });
        break;
      case "co_manager":
        newUser = await co_manager.create({
          id: newUserId,
          ...userData,
        });
        break;
      case "manager":
        newUser = await manager.create({
          id: newUserId,
          ...userData,
        });
        break;
      default:
        res.status(400).json({ error: "Bad request" });
        break;
    }

    const sessionId = uuidv4();
    await session.create({
      sid: sessionId,
      userId: newUserId,
    });

    res.json({
      message: "success",
      newUser,
      sessionId,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error " + error });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = {};
    const checkConstraints = {
      where: { email },
    };
    switch (role) {
      case "parent":
        user = await parent.findOne(checkConstraints);
        break;
      case "teacher":
        user = await teacher.findOne(checkConstraints);
        break;
      case "co_manager":
        user = await co_manager.findOne(checkConstraints);
        break;
      case "manager":
        user = await manager.findOne(checkConstraints);
        break;
      default:
        res.status(400).json({ error: "Role is missing" });
        break;
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const sessionId = uuidv4();

    await session.create({
      sid: sessionId,
      userId: user.id,
    });

    const userdata = {
      userId: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sessionId,
      role,
    };

    res.json({ message: "success", userdata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signOut = async (req, res) => {
  try {
    const sessionId = req.headers.authorization;

    const oldSession = await session.findOne({
      where: { sid: sessionId },
    });

    if (!oldSession) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    // log out from current session
    const deletedSessions = await session.destroy({
      where: { sid: sessionId },
    });

    if (deletedSessions === 0) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUsers, getUserById, signUp, signIn, signOut };
