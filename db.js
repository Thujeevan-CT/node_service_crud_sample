const database = require("mongoose");

exports.connectDatabase = async (req, res, next) => {
  try {
    // mongoose.set('strictQuery', true);
    await database.connect("mongodb+srv://thujeevan:2728@cluster0.bj7ul.mongodb.net/service-crud?retryWrites=true&w=majority");
    console.log("Database connected!");
    next();
  } catch (e) {
    console.log("Database connection failed!");
  }
};