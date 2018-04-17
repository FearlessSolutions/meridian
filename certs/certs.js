
const fs = require('fs');
console.log(__dirname)
module.exports = {
    key: fs.readFileSync('./certs/server/server.key.pem'),
    cert: fs.readFileSync('./certs/server/server.crt.pem'),
    ca: fs.readFileSync('./certs/server/root-ca.crt.pem')
};
