const { Op } = require("sequelize");
const { Event, User } = require("../config/model/index");
const multer = require("multer");

const dashboardController = {
  getAllEvents: async (req, res) => {
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
      } else {
        response = await Event.findAll({
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
            UserId: req.userId,
          },
          include: [
            {
              model: User,
              attributes: ["username", "email"],
            },
          ],
        });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const event = await Event.findOne({
        where: {
          id_event: req.params.id,
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
        if (req.userId !== event.userId) {
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
            [Op.and]: [{ id: event.id }, { userId: req.userId }],
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
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  searchEvents: async (req, res) => {
    try {
      const { search } = req.query;
      const events = await Event.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: search } },
            { description: { [Op.substring]: search } },
          ],
        },
      });
      res.status(201).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  filterEvents: async (req, res) => {
    try {
      const { free, paid } = req.query;
      let events;

      if (free === "1" && paid === "0") {
        events = await Event.findAll({
          where: { price: 0 },
        });
      } else if (paid === "1" && free === "0") {
        events = await Event.findAll({
          where: { price: { [Op.ne]: 0 } },
        });
      } else {
        events = await Event.findAll();
      }

      res.status(201).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  createEvent: async (req, res) => {
    try {
      const {
        title,
        desc,
        img,
        date,
        time,
        start_registration,
        end_registration,
        location,
        price,
        link_registration,
      } = req.body;

      if (title.length < 6) {
        return res.status(400).json({ message: "Judul minimal 6 karakter" });
      }

      if (desc.length < 100) {
        return res
          .status(400)
          .json({ message: "Deskripsi minimal 100 karakter" });
      }

      const event = await Event.create({
        title,
        desc,
        img,
        date,
        time,
        start_registration,
        end_registration,
        location,
        price,
        link_registration,
        UserId: req.userId,
      });
      res.status(201).json({ message: "Event berhasil dibuat", data: event });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateEvent: async (req, res) => {
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
        img,
        date,
        time,
        start_registration,
        end_registration,
        location,
        price,
        link_registration,
      } = req.body;

      if (req.role === "admin") {
        await event.update(
          {
            title: title !== undefined ? title : event.title,
            desc: desc !== undefined ? desc : event.desc,
            img: img !== undefined ? img : event.img,
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
          },
          {
            where: {
              id: event.id,
            },
          }
        );
      } else if (req.role === "user") {
        if (req.userId !== event.userId) {
          return res.status(403).json({ message: "Anda tidak memiliki akses" });
        }
        await event.update(
          {
            title: title !== undefined ? title : event.title,
            desc: desc !== undefined ? desc : event.desc,
            img: img !== undefined ? img : event.img,
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
          },
          {
            where: {
              [Op.and]: [{ id: event.id }, { userId: req.userId }],
            },
          }
        );
      }
      res.status(201).json({ message: "Event berhasil diupdate", data: event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteEvent: async (req, res) => {
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
        if (req.userId !== event.userId) {
          return res.status(403).json({ message: "Anda tidak memiliki akses" });
        }
        await Event.destroy({
          where: {
            [Op.and]: [{ id: event.id }, { userId: req.userId }],
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
