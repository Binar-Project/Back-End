const { Op } = require("sequelize");
const { Event, User } = require("../config/model/index");
const fs = require("fs");
const path = require("path");

const dashboardController = {
  getAllEvents: async (req, res) => {
    const { userId } = req.userId;

    const user = await User.findOne({
      where: {
        id_user: userId,
      },
    });

    try {
      let response;
      if (req.role === "admin") {
        response = await Event.findAll({
          include: [
            {
              model: User,
              attributes: ["username", "email"],
            },
          ],
        });
      } else if (req.role === "user") {
        response = await Event.findAll({
          where: {
            UserId: user.id,
          },
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        });
      } else {
        response = await Event.findAll((exclude = ["UserId,"]));
      }

      response = response.map((event) => {
        event.img = req.protocol + "://" + req.get("host") + "/" + event.img;
        return event;
      });

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getImage: async (req, res) => {
    const filename = encodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, "uploads", filename);

    // Mengecek apakah file ada atau tidak
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Jika file tidak ada, kirim respon error
        res.status(404).json({ message: "File not found" });
      } else {
        // Jika file ada, kirim file sebagai respons
        res.sendFile(filePath);
      }
    });
  },

  getEventById: async (req, res) => {
    const { userId } = req.userId;

    const user = await User.findOne({
      where: {
        id_user: userId,
      },
    });

    try {
      const eventId = req.params.id;
      const event = await Event.findOne({
        where: {
          id_event: eventId,
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event tidak ditemukan" });
      }

      let response;
      if (req.role === "admin") {
        response = await Event.findOne({
          where: {
            id: event.id,
          },
          include: [
            {
              model: User,
              attributes: ["username", "email"],
            },
          ],
        });
      } else if (req.role === "user") {
        if (user.id !== event.UserId) {
          return res.status(403).json({ message: "Anda tidak memiliki akses" });
        }
        response = await Event.findOne({
          attributes: [
            "id_event",
            "title",
            "desc",
            "img",
            "date",
            "time",
            "start_registration",
            "end_registration",
            "location",
            "price",
            "link_registration",
          ],
          where: {
            [Op.and]: [{ id: event.id }, { UserId: user.id }],
          },
          include: [
            {
              model: User,
              attributes: ["username", "email"],
            },
          ],
        });
      } else {
        response = await Event.findOne({
          where: {
            id: event.id,
          },
        });
      }

      if (response) {
        response.img =
          req.protocol + "://" + req.get("host") + "/" + response.img;
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "Event tidak ditemukan" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      // Ambil data acara dari body request
      const eventData = {
        title: req.body.title,
        desc: req.body.desc,
        // img: req.file.filename,
        img: encodeURIComponent(req.file.filename),
        date: req.body.date,
        time: req.body.time,
        start_registration: req.body.start_registration,
        end_registration: req.body.end_registration,
        location: req.body.location,
        price: req.body.price,
        link_registration: req.body.link_registration,
        // UserId: req.userId,
      };

      const { userId } = req.userId;

      const user = await User.findOne({
        where: {
          id_user: userId,
        },
      });

      if (user) {
        eventData.UserId = user.id;
      }
      // Simpan data acara ke database
      const createdEvent = await Event.create(eventData);

      // Jika acara berhasil dibuat
      if (createdEvent) {
        const imgPath = createdEvent.img.replace(/\\/g, " ");
        // Mengupdate nilai properti 'img' dengan path yang sudah diperbaiki

        createdEvent.img = imgPath;

        // Mengirimkan respons dengan objek acara yang sudah diperbaiki
        res.status(201).json(createdEvent);
      } else {
        // Jika acara gagal dibuat
        res.status(500).json({ error: "Gagal menambahkan event" });
      }
    } catch (errors) {
      // Jika terjadi kesalahan dalam menyimpan data acara ke database
      res.status(500).json({ error: errors.message });
    }
  },

  updateEvent: async (req, res) => {
    const { userId } = req.userId;

    const user = await User.findOne({
      where: {
        id_user: userId,
      },
    });

    try {
      const event = await Event.findOne({
        where: {
          id_event: req.params.id,
        },
      });
      if (!event)
        return res.status(404).json({ message: "Event tidak ditemukan" });

      const {
        title,
        desc,
        date,
        time,
        start_registration,
        end_registration,
        location,
        price,
        link_registration,
      } = req.body;

      const eventData = {
        title: title !== undefined ? title : event.title,
        desc: desc !== undefined ? desc : event.desc,
        img:
          req.file !== undefined
            ? encodeURIComponent(req.file.filename)
            : event.img,
        date: date !== undefined ? date : event.date,
        time: time !== undefined ? time : event.time,
        start_registration:
          start_registration !== undefined
            ? start_registration
            : event.start_registration,
        end_registration:
          end_registration !== undefined
            ? end_registration
            : event.end_registration,
        location: location !== undefined ? location : event.location,
        price: price !== undefined ? price : event.price,
        link_registration:
          link_registration !== undefined
            ? link_registration
            : event.link_registration,
      };

      if (req.role === "admin") {
        await event.update(eventData);
      } else if (req.role === "user") {
        if (user.id !== event.userId) {
          return res.status(403).json({ message: "Anda tidak memiliki akses" });
        }
        await event.update(eventData);
      }
      res.status(200).json({ message: "Event berhasil diupdate", data: event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    const { userId } = req.userId;

    const user = await User.findOne({
      where: {
        id_user: userId,
      },
    });

    try {
      const event = await Event.findOne({
        where: {
          id_event: req.params.id,
        },
      });
      if (!event) {
        return res.status(404).json({ message: "Event tidak ditemukan" });
      }
      if (req.role === "admin") {
        await Event.destroy({
          where: {
            id: event.id,
          },
        });
      } else {
        if (user.id !== event.userId) {
          return res.status(403).json({ message: "Anda tidak memiliki akses" });
        }
        await Event.destroy({
          where: {
            [Op.and]: [{ id: event.id }, { userId: user.id }],
          },
        });
      }
      res.status(200).json({ message: "Event berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = dashboardController;
