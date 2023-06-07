import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import https from "https";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const cityName = req.body.cityName;
  const query = cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url =
    process.env.API_URL + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = process.env.IMAGE_URL + icon + "@2x.png";

      res.write("<p>The weather is currently " + description + "</p>");
      res.write(
        "<h1>The temperature in " +
          cityName +
          " is currently " +
          temp +
          " degree Celsius.</h1>"
      );
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, () => {
  console.log("Running on 3000!");
});
