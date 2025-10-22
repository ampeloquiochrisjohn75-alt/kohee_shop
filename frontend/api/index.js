const serverless = require('serverless-http');
const app = require('./backend/server'); // export express app
module.exports.handler = serverless(app);
c