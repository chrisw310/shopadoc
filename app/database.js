/**
 * Created by Cameron on 22/04/2017.
 */
//~~~database variables~~~
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0&authSource=admin";

var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/shopAdoc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

//returns a list of doctors based on a query
//if data = "all" returns all doctors in the databse
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

function getContacts(callback){
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        db.collection('contacts').find().toArray(function(err, docs){
            assert.equal(null, err);
            callback(docs);
            db.close();
        });

    });
}

function addContact(data,callback){

    if(data.name && data.email && data.phone){
        MongoClient.connect(uri, function (err, db) {
            assert.equal(null, err);

            var doc = {_id: data.email, phone: data.phone, name:data.name};
            db.collection('contacts').insertOne(doc,function(err,r){
                if(err === null) {
                    assert.equal(1, r.insertedCount);
                    callback('ContactAdded');
                    db.close();
                }else{
                    switch(err.code){
                        case 11000:
                            callback('Email Already in use');
                            break;
                        default: callback('Invalid Contact Data');
                    }
                }
            });

        });
    }else{
        callback('Invalid Contact Data')
    }
}

/*var findCollections = function(db, callback) {
    var cursor =db.collection('contacts').find( );
    //var cursor =db.listCollections();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.log(doc);
            //console.dir(doc);
        } else {
            callback();
        }
    });
};

var insertData = function(db, callback){
    db.collection("contacts").insertOne({
        "phone" : "123456789",
        "email" : "cameron@mongo.com",
        "status": "Unknown"
        }, function(err, result){
        assert.equal(err,null);
        console.log('insterted test data into contacts');
        callback();
        });
};

function dbResponse(req,res){
    connectDb();
    res.send("string test");
    //return connectDb();
}*/

//export the functions in this script to be used by routes.js
module.exports.getContacts = getContacts;
module.exports.addContact = addContact;
module.exports.getDoctors = getDoctors;
module.exports.checkDoctor = checkDoctor;
module.exports.getReviews = getReviews;
module.exports.addReview = addReview;
//module.exports.connectDb = connectDb;
//module.exports.dbResponse = dbResponse;