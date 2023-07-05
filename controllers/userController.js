const { User } = require("../config/model/index");
// const argon2 = require("argon2");
// const bcrypt = require("bcrypt");

const userController = {
  // GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      let response;
      if (req.role === "admin") {
        response = await User.findAll({
          attributes: ["id_user", "username", "email", "role"],
        });
      } else {
        return res.status(403).json({ message: "Anda tidak memiliki akses" });
      }
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  // GET USER BY ID
  getUserById: async (req, res) => {
    try {
      const response = await User.findOne({
        attributes: ["id_user", "username", "email", "role"],
        where: {
          id_user: req.params.id,
        },
      });
      if (!response) {
        res.status(404).json({ message: "User tidak ditemukan" });
      } else {
        res.status(201).json(response);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // CREATE USER
  createUser: async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (username.length < 6) {
      return res.status(400).json({ message: "Username minimal 6 karakter" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password tidak sama" });
    }

    if (username == username.username) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const checkDuplicate = async (field, value) => {
      const existingUser = await User.findOne({
        where: {
          [field]: value,
        },
      });
      if (existingUser) {
        throw new Error(`${field} sudah digunakan`);
      }
    };

    // const hashedPassword = await bcrypt.hash(password);
    try {
      await checkDuplicate("username", username);
      await checkDuplicate("email", email);

      await User.create({
        username: username,
        email: email,
        password: password,
      });
      res.status(201).json({ message: "Registrasi berhasil" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // UPDATE USER
  updateUser: async (req, res) => {
    const user = await User.findOne({
      where: {
        id_user: req.params.id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const { username, email, password, confirmPassword } = req.body;

    // let hashedPassword;
    // if (password === "" || password === null) {
    //   hashedPassword = user.password;
    // } else {
    //   hashedPassword = await bcrypt.hash(password);
    // }

    if (username.length < 6) {
      return res.status(400).json({ message: "Username minimal 6 karakter" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password tidak sama" });
    }

    if (username == username.username) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const checkDuplicate = async (field, value) => {
      const existingUser = await User.findOne({
        where: {
          [field]: value,
        },
      });
      if (existingUser) {
        throw new Error(`${field} sudah digunakan`);
      }
    };

    try {
      await checkDuplicate("username", username);
      await checkDuplicate("email", email);

      await User.update(
        {
          username: username,
          email: email,
          password: password,
        },
        {
          where: {
            id_user: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Update berhasil" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // DELETE USER
  deleteUser: async (req, res) => {
    const user = await User.findOne({
      where: {
        id_user: req.params.id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    try {
      await User.destroy({
        where: {
          id_user: req.params.id,
        },
      });
      res.status(201).json({ message: "User berhasil Dihapus" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userController;
