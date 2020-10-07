const request = require('request');


const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiZ3JlZ290ZWw3IiwiYSI6ImNrZnA3cWMzdjA4ZWgyeHI1bmliemp1c2wifQ.Qu0bVgtMN77S41444H3DLw&limit=1';

    request({ url, json: true }, (error, { body }) => {
        if (error){
            callback("Unable to connect to location services!", undefined);
        }
        else if (body.features.length === 0){
            callback("Unable to find the location. Try another search.", undefined);
        }
        else {
            const longitude = body.features[0].center[0];
            const latitude = body.features[0].center[1];
            const location = body.features[0].place_name;
            callback(undefined, {longitude, latitude, location});
        }
    });
};

module.exports = geocode;