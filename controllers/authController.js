const { User } = require("../config/model/index");
const argon2 = require("argon2");

const authController = {
  Login: async (req, res) => {
    try {
      // validasi email
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Email yang Anda masukkan salah" });
      }
      // validate password
      const match = await argon2.verify(user.password, req.body.password);
      if (!match) {
        return res.status(400).json({ message: "Password salah" });
      }
      // set session

      req.session.userId = await user.id_user;
      const id_user = user.id_user;
      const username = user.username;
      const email = user.email;
      const role = user.role;
      res.status(200).json({ id_user, username, email, role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  Dashboard: async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Mohon Login ke akun anda" });
    }

    // Dapatkan informasi pengguna dari sesi
    const user = await User.findById(req.session.userId);

    // Kirim informasi pengguna ke klien
    res.status(200).json(user);
  },

  Logout: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout gagal" });
      }
      res.status(200).json({ message: "Logout berhasil" });
    });
  },
};

module.exports = authController;
