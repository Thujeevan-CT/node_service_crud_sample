const express = require("express");
const app = express();

app.use('/', (req, res) => {
  try {
    res.json({message: "Hello, We are coming from express server, Happy to connect with you Flutter!"})
  } catch (error) {
    console.log(error)
  }
})

app.use('/hello', (req, res) => {
  try {
    res.send("Hello");
    console.log("Hello");
  } catch (error) {
    console.log(error)
  }
})


app.listen(8080, () => {
  console.log("Backend is started on 8080")
})