/**
 * Created by Cameron on 28/03/2017.
 */
//~~~MAIN SERVER FILE~~~

//use express
var express = require('express');
var app = express();
var server = require('http').Server(app);
//var https = require('https');

//var fs = require('fs');
//var privateKey = fs.readFileSync('security/shopadoc_me.key').toString();
//var certificate = fs.readFileSync('security/shopadoc_me.crt').toString();
//var ca = fs.readFileSync('security/shopadoc_me.ca-bundle').toString();
//var credentials = { key: privateKey, cert: certificate, ca: ca };

//var server = https.createServer(credentials, app);

//var io = require('socket.io').listen(3456,credentials);
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

app.use(function(req, res){
    res.send('Not found page goes here');
});

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
    //Search the contacts collection in the DB
    socket.on('searchContacts',function(data){
        console.log(data); //probably use DATA in the future to ensure user is authentic

        //query the database using database.js
        mydb.getContacts(function(str){
            //return results to the client
            socket.emit('contacts',str);
        });

    });

    //add a new contact to the contacts collection
    socket.on('addContact',function(data){
        console.log("Attempting to add a client");
        //console.log(data);
        mydb.addContact(data, function(msg){
            socket.emit('addContact',msg);
        })
    });

    //search all the doctors in the databse
    socket.on('searchDoctors',function(data){
        console.log("Request to search doctors - " + data);
        //query the database using database.js
        mydb.getDoctors(data,function(str){
            //return results to the client
            socket.emit('doctors',str);
        });
    });

    //get the info on a specific doctor
    socket.on('listingDoctor',function(data){
        console.log("Request to list doctor - " + data);
        mydb.checkDoctor(data,function(str){
            //resturn the resuts to the client
            socket.emit('listingDoctor',str);
        })
    });

    //get the reviews for a specific doctor
    socket.on('requestReviews',function(data){
        //console.log("Request to get " + data + "'s reviews");
        mydb.getReviews(data,function(str){
            //resturn the results to the client
            //console.log('Returning reviews');
            socket.emit('recievedReviews',str);
        })
    });

    socket.on('addReview',function(data){
        console.log('adding a review');
        console.log(data);
        mydb.addReview(data,function(str){
            socket.emit('addReviewResponse',str)
        })
    });

    socket.on('requestTimes',function(data){
        console.log("Request to get " + data + "'s avaiable hours");
        mydb.getAvailability(data,function(str){
            //resturn the results to the client
            //console.log('Returning reviews');
            socket.emit('recievedTimes',str);
        })
    });

    socket.on('makeBooking',function(data){
        console.log('Request to make a booking');
        console.log(data);
        mydb.makeBooking(data,function(str){
            socket.emit('bookingResponse',str)
        })
    });
	
	var profile = {};
	profile.loggedIn = false;
	
	socket.on('clientSignIn', function(data, callback) {
		console.log("clientSignIn");
		var GoogleAuth = require('google-auth-library');
		var auth = new GoogleAuth;
		var CLIENT_ID = '390784971133-mfjqrepf91ib0tlhekjo375qok0nf1v7.apps.googleusercontent.com';
		var client = new auth.OAuth2(CLIENT_ID, '', '');
		client.verifyIdToken(
			data.token,
			CLIENT_ID,
			function(e, login) {
				var returnData = {}; // data to return to client in callback
				if (login != null) {
					console.log("login verified");
					var payload = login.getPayload();
					// store data
					profile.id = payload['sub'];
					profile.name = payload['name'];
					profile.email = payload['email'];
					profile.pictureUrl = payload['picture'];
					profile.loggedIn = true;
					//data to return to client in callback
					returnData.name = profile.name;
					returnData.pictureUrl = profile.pictureUrl;
					returnData.email = profile.email;
					
					// TODO: store profile in database
					
				} else {
					returnData.err = e;
					console.log("login verification failed: "+ e);
				}
				callback(returnData);
			}
		);
	});
	
	socket.on('clientSignOut', function() {
		console.log("clientLoggedOut");
		profile = {};
		profile.loggedIn = false;
	});
	
	socket.on('checkLoginStatus', function(callback) {
		callback(profile.loggedIn);
	});
});