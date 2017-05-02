/**
 * Created by Cameron on 28/03/2017.
 */
//~~~MAIN SERVER FILE~~~

//use express
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//server port
var port = 80;

//import the routes.js file
var router = require('./app/routes');
app.use('/', router);

//static files (css, images etc)
//publicly available
app.use(express.static(__dirname + '/public'));

// start the server and listen on port 80
server.listen(port,function(){
    console.log('ShopADoc Server started');
});


//socket for client-server communication
io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});