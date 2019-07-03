const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const swaggerDoc = require('./swaggerDoc');
const mongoose = require("mongoose");

mongoose.connect(
    //`mongodb://${process.env.MONGO_USR || "app_user"}:${process.env.MONGO_PW || "Qwerty123"}@cluster0-shard-00-00-mrgqo.mongodb.net:27017,cluster0-shard-00-01-mrgqo.mongodb.net:27017,cluster0-shard-00-02-mrgqo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
    "mongodb://app_user:Qwerty123@cluster0-shard-00-00-mrgqo.mongodb.net:27017,cluster0-shard-00-01-mrgqo.mongodb.net:27017,cluster0-shard-00-02-mrgqo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true }
);

const app = express();

swaggerDoc(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
const providers = require("./api/routes/providers");
const clients = require("./api/routes/clients");

app.use("/api/providers", providers);
app.use("/api/clients", clients);

app.use((req, res, next) => {
  const error = new Error("Method not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Handle production 
if (process.env.NODE_ENV === 'production') {
  const publicFolder = __dirname + '/public/'
  // Static folder
  app.use(express.static(publicFolder));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(publicFolder + 'index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App started on port ${port}`));