const path = require("path");
const express = require("express");
// We load hbs for partials with handlebars. (parts of a webpage that we reuse)
const hbs = require("hbs");
const { resolveSoa } = require("dns");

// If we had the webserver in a separate folder outside the weather-app, we would put the utils folder inside the src folder of the web-server.
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express config
// It's a way to customize our server
const publicDirectory = path.join(__dirname, "../public");
// To customize our views folder (so not to look for a views folder for the .hbs files)
const viewsPath = path.join(__dirname, "../templates/views");
// We define the path to the partials
const partialsPath = path.join(__dirname, "../templates/partials");

// We set the static directory
app.use(express.static(publicDirectory));

// Setup handlebars engine and views location 
// Telling express which templating engine we installed.
// It looks for the files in a views folder at the root level.
app.set("view engine", "hbs");
// We configure to look for the files in the templates folder.
app.set('views', viewsPath);
// The configuration of the partials
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
    // We provide a variable to the index.hbs
    res.render("index", {
        title: "Weather",
        name: "Gregory Kaframanis"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
        name: "Gregory Kaframanis"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        helpText: "This is some helpful text.",
        name: "Gregory Kaframanis"
    });
});

// localhost:3000/weather
// We istall with npm the request module because it's used in forecast.js and geocode.js
app.get("/weather", (req, res) => {
    if (!req.query.address){
        return res.send({
            error: "You must provide an address!"
        });
    }

    // We set a default value for destructuring in case no data is provided.
     geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if (error){
            return res.send({ error });
        }
        else {
            forecast(longitude, latitude, (error, forecastData) => {
                if (error) {
                    res.send({ error });
                }
                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address

                });
            });
        }
    });
});



// More specific 404 page no for all the requests.
app.get("*/help/*", (req, res) => {
    res.render("404", {
        title: "404 page",
        errorMessage: "Help article not found.",
        name: "Gregory Kaframanis"
    });
});

// 404 page - * Match anything that hasn't been matched so far
// This always comes last: express looks from top - down for a match.
app.get("*", (req, res) => {
    res.render("404", {
        title: "404 page",
        errorMessage: "Page not found.",
        name: "Gregory Kaframanis"
    });
});


// Now we need to start the server up // 3000 is a common development port
app.listen(3000, () => {
    console.log("Server is up on port 3000.");
});
