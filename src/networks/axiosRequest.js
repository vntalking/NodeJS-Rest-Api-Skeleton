const axios = require('axios');

// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: process.env.LIBGEN_URL
});


module.exports = instance;