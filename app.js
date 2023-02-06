const cluster = require("cluster");
const { cpus } = require("os");
const express = require("express");
const { connectDatabase } = require("./db");
const app = express();
const cors = require("cors");
const Service = require("./servicesModel");
const morgan = require("morgan");

const coreCounts = cpus().length; // get cpu core count

if (cluster.isMaster) {
  console.log("Cpus count: ", coreCounts);
  // Create a worker for each core
  for (let i = 0; i < coreCounts; i++) {
    cluster.fork();
  }
  cluster.on("online", (worker) => {
    console.log("Worker " + worker.process.pid + " is online.");
  });
  cluster.on("exit", (worker, code, signal) => {
    console.log("worker " + worker.process.pid + " died.");
  });
} else {

  app.use(cors());
  app.options("*", cors());
  app.use(express.json());
  app.use(connectDatabase);
  app.use(morgan("tiny"));

  app.get('/', async (req, res) => {
    try {
      return res.status(200).send("<h1>SERVICE CRUD API SERVER</h1>");
    } catch (error) {
      console.log(error);
    }
  });

  app.get('/services', async (req, res) => {
    try {
      const allData = await Service.find();

      if (!allData) {
        res.status(404).send("Something went wrong!");
      }

      return res.status(200).json({
        code: 200,
        status: true,
        message: "All data fetched",
        data: allData,
      });

    } catch (error) {
      console.log(error);
    }
  });

  app.get('/service/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).send("ID not found!");
      }

      const service = await Service.findById(id);

      if (!service) {
        res.status(404).send("Service not found!");
      }

      return res.status(200).json({
        code: 200,
        status: true,
        message: "Service updated",
        data: service,
      });

    } catch (error) {
      console.log(error);
    }
  });

  app.post('/service/new', async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title) {
        res.status(404).send("Title required!");
      }

      if (!description) {
        res.status(404).send("Description required!");
      }

      const response = await Service({
        title: title,
        description: description,
      });

      const data = await response.save();

      return res.status(200).json({
        code: 200,
        status: true,
        message: "New service created",
        data: data,
      });

    } catch (error) {
      console.log(error);
    }
  });

  app.put('/service/update/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).send("ID not found!");
      }

      const { title, description } = req.body;

      const oldService = await Service.findById(id);

      if (!oldService) {
        res.status(404).send("Service not found!");
      }

      const newData = await Service.findByIdAndUpdate(
        id,
        {
          title: title ? title : oldService.title,
          description: description ? description : oldService.description,
        },
        { returnOriginal: false }
      );

      return res.status(200).json({
        code: 200,
        status: true,
        message: "Service updated",
        data: newData,
      });

    } catch (error) {
      console.log(error);
    }
  });

  app.delete('/service/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).send("ID not found!");
      }

      const oldService = await Service.findByIdAndDelete(id);

      if (!oldService) {
        res.status(404).send("Service not found!");
      }

      return res.status(200).json({
        code: 200,
        status: true,
        message: "Service deleted",
      });

    } catch (error) {
      console.log(error);
    }
  });



  app.listen(8080, () => {
    console.log("Server started");
  });

}