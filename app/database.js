/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Server side script
    File to manage database communication

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


//~~~database variables~~~
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/shopAdoc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";


//import the emailer.js file
var myEmailer = require('./emailer');


//returns a list of doctors based on a query
//if data = "all" returns all doctors in the database
function getDoctors(data,callback){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        var conditions;
        if(data === "all"){
            conditions = null;
        }else {
            conditions = {
                $text: {
                    $search: data,
                    $language: "en",
                    $caseSensitive: false,
                    $diacriticSensitive: false
                }
            };
        }
        db.collection('doctors').find(conditions).toArray(function(err, docs){
            assert.equal(null, err);
            callback(docs);
            db.close();
        });

    });
}

//check if doctor <name> is in the database
//if so, return the doctor's information
function checkDoctor(name,callback){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        db.collection('doctors').find({'name':name}).toArray(function(err, docs){
            assert.equal(null, err);
            callback(docs);
            db.close();
        });

    });
}

//gets the reviews for doctor <name>
function getReviews(name,callback){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        db.collection('reviews').find({'doctorName':name}).toArray(function(err, docs){
            assert.equal(null, err);
            callback(docs);
            db.close();
        });

    });
}

//returns the availability of doctor <name>
function getAvailability(name,callback){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        db.collection('doctorAvailability').find({'doctorName':name}).toArray(function(err, docs){
            assert.equal(null, err);
            callback(docs);
            db.close();
        });

    });
}

//adds a review to the database
function addReview(data,cb){
    if(typeof(data.doctorName)!== 'undefined' && typeof(data.rating)!== 'undefined' && typeof(data.reviewerName)!== 'undefined' && typeof(data.reviewerPhotoURL)!== 'undefined' && typeof(data.comment)!== 'undefined'){
        MongoClient.connect(uri, function (err, db) {
            if (err === null) {
                //data.rating = parseInt(data.rating);
                if((data.rating >0) && (data.rating < 6)){
                    var doc = {doctorName: data.doctorName, rating: data.rating, reviewerName: data.reviewerName, reviewerPhotoURL: data.reviewerPhotoURL, comment:data.comment};
                    console.log(doc);
                    db.collection('reviews').insertOne(doc, function (err, r) {
                        if (err === null) {
                            assert.equal(1, r.insertedCount);
                            cb('Review Added');
                            db.close();
                        } else {
                            //cb('Invalid Review data');
                            cb(err.message);
                        }
                    });
                }else{
                    cb('Invaild rating');
                }
            }

        });
    }else{
        cb('Invalid Review Format');
    }
}

//modify a doctor's availability (used after making a booking)
function updateAvailibility(availData){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        var res = db.collection('doctorAvailability').updateOne({_id: availData._id},availData,{ upsert: false });
        if(res.nModified === 1){
            console.log('availability updated');
        }
        db.close();
    });
}

//add a booking to the database
function addBooking(bookingData){
    if(typeof(bookingData.doctorName)!== 'undefined' && typeof(bookingData.day)!== 'undefined' && typeof(bookingData.time)!== 'undefined' && typeof(bookingData.clientEmail)!== 'undefined') {
        MongoClient.connect(uri, function (err, db) {
            if (err === null) {
                //data.rating = parseInt(data.rating);
                var doc = {
                    doctorName: bookingData.doctorName,
                    day: bookingData.day,
                    time: bookingData.time,
                    clientEmail: bookingData.clientEmail
                };
                //console.log(doc);
                db.collection('bookings').insertOne(doc, function (err, r) {
                    if (err === null) {
                        assert.equal(1, r.insertedCount);
                        console.log('Booking Added');
                        db.close();
                    } else {
                        //cb('Invalid Review data');
                        console.log(err.message);
                    }
                });
            }
        });
    }
}

//called when a client confirms a booking
//adds booking to database
//modifies the dector's availability (above two functions)
//emails the client
function makeBooking(bookingData,cb){
    //check time isnt already booked
    getAvailability(bookingData.doctorName,function(availData){
        //console.log(data);

        for(var i=0; i<availData.length; i++){
            var day1 = new Date(availData[i].day);
            var day2 = new Date(bookingData.day);
            if((day1.getFullYear() === day2.getFullYear())&&(day1.getMonth() === day2.getMonth())&&(day1.getDate()===day2.getDate())){
                console.log('same day found, checking time');
                //console.log(availData[i]);
                var available = availData[i].times[bookingData.time];
                if(available === undefined){
                    console.log('time undefined');
                    cb('Invalid Appointment Time')
                }else if(available === 1){
                    console.log('doctor available,allocating booking');
                    //modify avaiabliity
                    availData[i].times[bookingData.time] = 0;
                    //console.log(availData[i]);
                    updateAvailibility(availData[i]);
                    //addbooking
                    addBooking(bookingData);
                    //email the client
                    myEmailer.sendEmail(bookingData);
                    cb('Booking Confirmed, you should receive a confirmation email shortly');

                }else{
                    cb('Sorry, doctor unavaiable at this time');
                }
                return
            }
        }
        cb('Doctor\'s Availability not found');
        console.log('availability not found');

    });
}

//gets the user's saved doctors
function getSavedDocs(email,callback){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        db.collection('savedDoctors').find({'email':email}).toArray(function(err, docs){
            assert.equal(null, err);
            if(docs.length === 0){
                console.log('User is not part of our database');
                callback('User is not part of our database');
            }else{
                var savedList = docs[0].savedDocs;
                if(savedList.length === 0){
                    console.log('user has no saved doctors');
                    callback([]);
                }else{
                    var returnData = [];
                    for(var j=0; j<savedList.length;j++){
                        console.log('Getting doctor info for: ' + savedList[j]);
                        db.collection('doctors').find({'name':savedList[j]}).toArray(function(err, docs){
                            assert.equal(null, err);
                            if(docs.length !== 0){
                                //callback(docs[0]);
                                //console.log(docs[0]);
                                returnData[returnData.length] = docs[0];
                                if(returnData.length === savedList.length){
                                    callback(returnData);
                                }
                                //console.log(returnData);
                            }
                        });
                    }
                    //callback(returnData);
                }
            }
            db.close();
        });
    });
}

//add a given doctor to the user's saved doctor list
function addSavedDocs(data, callback){
    console.log(data);
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);

        //try find the user's existing  list of saved doctors
        db.collection('savedDoctors').find({'email':data.email}).toArray(function(err, docs){
            assert.equal(null, err);
            //console.log(docs);

            if(docs.length === 0){
                console.log('New entry detected, creating saved doctor list');
                db.collection('savedDoctors').insertOne({email:data.email, savedDocs: [data.docName]}, function (err, r) {
                    if (err === null) {
                        assert.equal(1, r.insertedCount);
                        console.log('Doctor added to saved list');
                        callback('Doctor saved');
                        db.close();
                    } else {
                        //cb('Invalid Review data');
                        console.log(err.message);
                        callback('Adding Doctor Failed');
                    }
                });
            }else{
                var docAlreadSaved = 0;
                var myNewDoc = docs[0];
                //console.log(myNewDoc);

                for( var j=0; j<myNewDoc.savedDocs.length;j++){
                    if(myNewDoc.savedDocs[j] === data.docName){
                        docAlreadSaved = 1;
                        console.log("Doctor already part of client's saved list");
                        callback('Doctor already in your list of saved doctors');
                    }
                }

                if(docAlreadSaved === 0){
                    console.log('Adding doc to client\'s saved doctors');
                    myNewDoc.savedDocs[myNewDoc.savedDocs.length] = data.docName;
                    //console.log(myNewDoc);
                    var res = db.collection('savedDoctors').updateOne({email: data.email},myNewDoc,{ upsert: false });
                    console.log('Doctor Saved');
                    callback('Doctor saved');
                }

            }
            db.close();
        });
    });
}

//remove a doctor form the user's saved doctors list
function removeSavedDocs(data, callback){
    console.log(data);
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);

        //try get the user's
        db.collection('savedDoctors').find({'email':data.email}).toArray(function(err, docs){
            assert.equal(null, err);
            //console.log(docs);

            if(docs.length === 0){
                console.log('Doctor not in saved doctor list');
            }else{
                var myNewDoc = docs[0];
                console.log(myNewDoc);

                for( var j=0; j<myNewDoc.savedDocs.length;j++){
                    if(myNewDoc.savedDocs[j] === data.docName){
						db.collection('savedDoctors').update({email: data.email, savedDocs : data.docName}, {$pull: {"savedDocs" : data.docName}}, function(err, r) {
							if (err === null) {
								console.log('Doctor removed');
								//console.log(r);
								callback('Doctor removed');
								db.close();
								
							} else {
								console.log(err.message);
								callback('Removing Doctor from saved list failed');
							}
						});
                    }
                }
				

            }
            db.close();
        });
    });
}

//export the functions in this script to be used by routes.js
module.exports.getDoctors = getDoctors;
module.exports.checkDoctor = checkDoctor;
module.exports.getReviews = getReviews;
module.exports.addReview = addReview;
module.exports.getAvailability = getAvailability;
module.exports.makeBooking = makeBooking;
module.exports.getSavedDocs = getSavedDocs;
module.exports.addSavedDocs = addSavedDocs;
module.exports.removeSavedDocs = removeSavedDocs;