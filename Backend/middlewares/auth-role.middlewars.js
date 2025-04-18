const jwt = require("jsonwebtoken");
const Session = require("../models/session");

async function authMiddleware(req, res, next) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token not provided" });
    }

    const user = jwt.verify(token, "apex1");

    if (user.status !== "active") {
      return res.status(401).send({
        message: "You did not verify your account. Please verify it.",
      });
    }

    const session = await Session.findOne({
      where: { user_id: user.id, ip: req.ip },
    });

    if (!session) {
      return res
        .status(401)
        .send({ message: "No session detected please log in again" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired" });
    }
    return res.status(401).send({ message: "Invalid token" });
  }
}

function roleMiddleware(roles) {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "Token not provided" });
      }

      const user = jwt.verify(token, "apex1");

      if (user.status !== "active") {
        return res.status(401).send({
          message: "You did not verify your account. Please verify it.",
        });
      }

      const session = await Session.findOne({
        where: { user_id: user.id, ip: req.ip },
      });

      if (!session) {
        return res
          .status(401)
          .send({ message: "No session detected please log in again" });
      }
      if (roles.includes(user.role)) {
        req.user = user;
        next();
      } else {
        return res
          .status(403)
          .send({ message: "You are not allowed to access this route" });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }
      return res.status(401).send({ message: "Invalid token" });
    }
  };
}

module.exports = { authMiddleware, roleMiddleware };
