const { User } = require("../config/model/index");
const secretKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, secretKey);

    req.userId = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Tidak dapat mengakses akun Anda" });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { userId } = req.userId;

    if (!req.userId) {
      return res.status(401).json({ message: "Mohon Login ke akun Anda" });
    }

    const user = await User.findOne({
      where: {
        id_user: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    req.role = user.role;

    next();
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

const verifyAdmin = async (req, res, next) => {
  const { userId } = req.userId;

  if (!req.userId) {
    return res.status(401).json({ message: "Mohon Login ke akun Anda" });
  }

  try {
    const user = await User.findOne({
      where: {
        id_user: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Anda tidak memiliki akses" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
