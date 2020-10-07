const request = require("request");

const forecast = (lon, lat, callback) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f979d678fda661df601e26257e3f0dd0&units=metric`;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to weather service!", undefined);
        }
        else if (body.message) {
            callback("Unable to find the location...", undefined);
        }
        else {
            callback(undefined, `It is currently ${body.main.temp} degrees out. The weather description is '${body.weather[0].description}'.`);
        }
    });
};

module.exports = forecast;