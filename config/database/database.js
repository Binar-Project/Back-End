const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.APP_PORT,
    dialect: "mysql",
  }
);

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connected to MySQL database!");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MySQL:", error);
//   });

// (async () => {
//   try {
//     await sequelize.sync();
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Error synchronizing models:", error);
//   }
// })();

module.exports = sequelize;
