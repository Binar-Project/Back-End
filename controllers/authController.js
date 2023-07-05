// authController.js

const { User } = require("../config/model/index");
// const argon2 = require("argon2");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

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
      // const match = await bcrypt.compare(user.password, req.body.password);
      // if (!match) {
      //   return res.status(400).json({ message: "Password salah" });
      // }

      if (user.password !== req.body.password) {
        return res.status(400).json({ message: "Password salah" });
      }

      // Generate JWT token
      var token = jwt.sign({ userId: user.id_user }, secretKey, {
        expiresIn: 86400,
      });

      const id_user = user.id_user;
      const username = user.username;
      const email = user.email;
      const role = user.role;

      res.status(200).json({
        id_user,
        username,
        email,
        role,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal melakukan login" });
    }
  },

  Dashboard: async (req, res) => {
    try {
      const { userId } = req.userId;

      const user = await User.findOne({
        attributes: ["id_user", "username", "email", "role"],
        where: {
          id_user: userId,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      console.log(req.userId);
      res.status(500).json({ message: "Mohon login ke akun Anda" });
    }
  },

  Logout: async (req, res) => {
    // Tidak perlu menghapus JWT token dari sisi server
    res.status(200).json({ message: "Logout berhasil" });
  },
};

module.exports = authController;
