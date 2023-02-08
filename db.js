const database = require("mongoose");

exports.connectDatabase = async (req, res, next) => {
  try {
    // mongoose.set('strictQuery', true);
    await database.connect(); // Add your database
    console.log("Database connected!");
    next();
  } catch (e) {
    console.log("Database connection failed!");
  }
};
