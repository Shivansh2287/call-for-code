// import dependencies and initialize express
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Load the Cloudant library.
var Cloudant = require("@cloudant/cloudant");

// Initialize Cloudant with settings from .env
var url =
  "https://apikey-v2-5m3btxtjilelalxz1iptf9bpd0dxng4bwrz9kfxx8ja:5720a4cfc3164b5e1f105934f8c22297@596b58ab-d885-4ab3-b5b1-ae1b4b9eac93-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-5m3btxtjilelalxz1iptf9bpd0dxng4bwrz9kfxx8ja";
var password = "5720a4cfc3164b5e1f105934f8c22297";
var cloudant = Cloudant({ url: url, username: username, password: password });

// Using the async/await style.

async function asyncCall() {
  // await cloudant.db.create("alice");
  return cloudant.use("alice").insert({ happy: false }, "dog");
}

asyncCall()
  .then((data) => {
    console.log(data); // { ok: true, id: 'rabbit', ...
  })
  .catch((err) => {
    console.log(err);
  });

const healthRoutes = require("./routes/health-route");
const swaggerRoutes = require("./routes/swagger-route");

const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes and api calls
app.use("/health", healthRoutes);
app.use("/swagger", swaggerRoutes);

// default path to serve up index.html (single page application)
app.all("", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../public", "index.html"));
});

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../public", "404.html"));
});

module.exports = app;
