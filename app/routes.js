/**
 * Created by Cameron on 29/03/2017.
 */
//~~~SPECIFY ROUTES FOR HTTP REQUESTS~~~~

//required modules
var express = require('express');
var path = require('path');
//import the databas.js script
//var mydb = require('./database');

//create the router
var router = express.Router();

//export our router so it can be used by server.js
module.exports = router;

//HOMEPAGE
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'../html/index.html'));
});

// parameter middleware that will run before the next routes
router.param('name', function(req, res, next, name) {

    // check if the user with that name exists
    //query db to find name, if the name doesnt exist, go to a page not found page
    console.log(name);

    if (name === 'wrong') {
        next('no doctor found by that name');
    }else{
        //continue to desired page
        next();
    }

});

//LISTING PAGE
router.get('/listing/:name',function(req,res){
    console.log('listing route');
    res.sendFile(path.join(__dirname,'../html/index.html'));

});



//CAMERON'S TESTING PAGE
router.get('/cameron',function(req,res){
    res.sendFile(path.join(__dirname,'../html/testing.html'));
});

//HEARTBEAT TO CHECK SERVER HEALTH
router.get('/heartbeat',function(req,res){
   res.send('OK');
});


//client request to the server
//learn how to make this secure (do I use POST method along with a key?)
//probably change this to socket.io code??
//router.get('/server',function(req,res){
    //call "dbResponse" from the databse.js script
//    mydb.dbResponse(req,res);
//});