var http = require('http');
var app = require('./app')


var server = http.createServer(app);

server.listen(process.env.PORT || 1300, () => {
    console.log("Server is listening: 1300")
})