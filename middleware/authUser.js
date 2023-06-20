const verifyUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Mohon Login ke akun anda" });
    }
    const user = await User.findOne({
      where: {
        id_user: req.session.userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    req.userId = user.id_user;
    req.role = user.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan dalam verifikasi pengguna" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id_user: req.session.userId,
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
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan dalam verifikasi pengguna" });
  }
};

module.exports = { verifyUser, verifyAdmin };
