
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const swaggerDoc = require('./swaggerDoc');
const mongoose = require("mongoose");

// TODO: Move to config
mongoose.connect(
    "mongodb://app_user:Qwerty123@cluster0-shard-00-00-mrgqo.mongodb.net:27017,cluster0-shard-00-01-mrgqo.mongodb.net:27017,cluster0-shard-00-02-mrgqo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true }
);

const app = express();

swaggerDoc(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// TODO: Move routes to file which should handle requests
const providers = require("./routes/api/v1/providers");
const clients = require("./routes/api/v1/clients");

app.use("/api/providers", providers);
app.use("/api/clients", clients);

// Handle production 
if (process.env.NODE_ENV === 'production') {
  const publicFolder = __dirname + '/public/'
  // Static folder
  app.use(express.static(publicFolder));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(publicFolder + 'index.html'));
}

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

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App started on port ${port}`));