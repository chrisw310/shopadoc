/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Server side script
    File to redirect http requests

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//required modules
var express = require('express');
var path = require('path');
//import the databas.js script (talks to the database)
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