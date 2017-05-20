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
var port = 3000;

//import the routes.js file
var router = require('./app/routes');
app.use('/', router);

//import the databse.js file
var mydb = require('./app/database');

//static files (css, images etc)
//publicly available
app.use(express.static(__dirname + '/public'));

// start the server and listen on port 80
server.listen(port,function(){
    console.log('ShopADoc Server started');
});


//socket for client-server communication
io.on('connection', function (socket) {
    socket.emit('connectedToServer', 'Server Connection Established!');

    socket.on('clientConnect', function (data) {
        console.log(data);
    });

    socket.on('searchContacts',function(data){
        console.log(data); //probably use DATA in the future to ensure user is authentic

        //query the database using database.js
        mydb.getContacts(function(str){
            //return results to the client
            socket.emit('contacts',str);
        });

    });

    socket.on('addContact',function(data){
        console.log("Attempting to add a client");
        //console.log(data);
        mydb.addContact(data, function(msg){
            socket.emit('addContact',msg);
        })
    });

    socket.on('searchDoctors',function(data){
        console.log("Request to search doctors - " + data);
        //query the database using database.js
        mydb.getDoctors(data,function(str){
            //return results to the client
            socket.emit('doctors',str);
        });
    });

    socket.on('listingDoctor',function(data){
        console.log("Request to list doctor - " + data)
        mydb.checkDoctor(data,function(str){
            //resturn the resuts to the client
            socket.emit('listingDoctor',str);
        })
    })
});