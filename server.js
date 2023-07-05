const cors_anywhere = require('cors-anywhere');

const host = 'localhost';
const port = 8000;

cors_anywhere.createServer().listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

