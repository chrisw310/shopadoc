/**
 * Created by Cameron on 29/03/2017.
 */
//~~~SPECIFY ROUTES FOR HTTP REQUESTS~~~~

//required modules
var express = require('express');
var path = require('path');
//import the databas.js script
var mydb = require('./database');

//create the router
var router = express.Router();

//export our router so it can be used by server.js
module.exports = router;

//HOMEPAGE
router.get('/',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    res.sendFile(path.join(__dirname,'../html/index.html'));
});

// parameter middleware that will run before the next routes
router.param('name', function(req, res, next, name) {
    //console.log('Does doctor exist? ' + name);
    // check if the user with that name exists
    //query db to find name, if the name doesnt exist, go to a page not found page
    //console.log(name);
    /*mydb.checkDoctor(name,function(result){
        console.log(result);
        if (result.length === 0) {
            next('no doctor found by that name (opportunity to add a new page)');
        }else{
            //continue to desired page
            //next();
            res.sendFile(path.join(__dirname,'../html/listing.html'));
        }
    });*/
    next();
});

//LISTING PAGE
router.get('/listing/:name',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    console.log('Providing the listing.html page');
    res.sendFile(path.join(__dirname,'../html/listing.html'));
});

//PRECONFIRM PAGE
router.get('/preConfirm/:name',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    console.log('Providing the preconfirm.html page');
    res.sendFile(path.join(__dirname,'../html/preconfirm.html'));
});

//CONFIRM PAGE
router.get('/confirm/:name',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    console.log('Providing the confirm.html page');
    res.sendFile(path.join(__dirname,'../html/confirm.html'));
});

//CONFIRM PAGE
router.get('/signup/',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    console.log('Providing the signup.html page');
    res.sendFile(path.join(__dirname,'../html/signup.html'));
});

//CAMERON'S TESTING PAGE
router.get('/cameron',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    res.sendFile(path.join(__dirname,'../html/testing.html'));
});

//HEARTBEAT TO CHECK SERVER HEALTH
router.get('/heartbeat',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    res.send('OK');
});

//SIGNUP PAGE
router.get('/signup',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    console.log('Providing the signup.html page');
    res.sendFile(path.join(__dirname,'../html/signup.html'));
});

//LOGIN PAGE (REDIRECTS TO SIGNUP)
router.get('/login',function(req,res){
    if((req.headers['x-forwarded-proto'] === 'http') && (req.headers['host'] === 'www.shopadoc.me')){
        console.log('Redirecting http request to https');
        res.redirect('https://'+req.headers['host']+req.url)
    }
    console.log('Providing the signup.html page');
    res.sendFile(path.join(__dirname,'../html/signup.html'));
});

//client request to the server
//learn how to make this secure (do I use POST method along with a key?)
//probably change this to socket.io code??
//router.get('/server',function(req,res){
    //call "dbResponse" from the databse.js script
//    mydb.dbResponse(req,res);
//});