const { Event } = require("../config/model/index");
const { Op } = require("sequelize");
const { User } = require("../config/model/index");

const eventController = {
  getAllEventsGuest: async (req, res) => {
    try {
      const events = await Event.findAll({
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
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });

      const response = events.map((event) => {
        event.img = req.protocol + "://" + req.get("host") + "/" + event.img;
        return event;
      });

      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
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

  getEventByIdGuest: async (req, res) => {
    try {
      const response = await Event.findOne({
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
          id_event: req.params.id,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      if (!response) {
        res.status(404).json({ message: "Event tidak ditemukan" });
      } else {
        response.img = req.protocol + "://" + req.get("host") + "/" + event.img;
        res.status(201).json(response);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchEventsGuest: async (req, res) => {
    try {
      const keywords = req.query.q.split(" ");
      const response = await Event.findAll({
        where: {
          title: {
            [Op.iLike]: { [Op.any]: keywords.map((keyword) => `%${keyword}%`) },
          },
        },
      });
      if (!response.length) {
        res.status(404).json({ message: "Event tidak ditemukan" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = eventController;
