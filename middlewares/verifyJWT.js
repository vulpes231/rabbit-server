const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header)
    return res.status(401).json({ message: "You are not logged in!" });

  const token = header.split(" ")[1];
  // console.log(`Bearer ${token}`);
  if (!token) return res.status(403).json({ message: "Forbidden!" });

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(400).json({ message: "Bad token!" });
    req.user = decoded.user;
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    req.admin = decoded.admin;
    req.superUser = decoded.superUser;

    next();
  });
};

module.exports = { verifyJWT };
