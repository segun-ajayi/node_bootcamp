const nodegeocoder = require('node-geocoder');
const option = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_KEY,
    formatter: null
}

const geocoder = nodegeocoder(option);

module.exports = geocoder;