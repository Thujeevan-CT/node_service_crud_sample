const database = require("mongoose");

exports.connectDatabase = async (req, res, next) => {
  try {
    // mongoose.set('strictQuery', true);
    await database.connect(process.env.DATABASE_URL); // Add your database
    console.log("Database connected!");
    next();
  } catch (e) {
    console.log("Database connection failed!");
  }
};
