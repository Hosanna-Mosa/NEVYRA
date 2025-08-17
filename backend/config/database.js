const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    "postgresql://ecomestore_user:zZydoqQS91HGUcfUnVJhuhgGsiv23UBp@dpg-d1tv083e5dus73e1ksug-a.oregon-postgres.render.com/ecomestore",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For most managed DBs; set to true for stricter security
      },
    },
  }
);

module.exports = { sequelize };
