const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();
const dashboardRoutes = require("./routes/dashboardRoute");
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoute");
const eventRoutes = require("./routes/eventRoute");

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    credentials: true,
    origin: ["http://vent-us.com", "https://react.achmadsyarif.com"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);

app.listen(process.env.PORT || 7852, () => {
  console.log(`Server is running on port ${process.env.PORT || 7852}`);
});
