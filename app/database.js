/**
 * Created by Cameron on 22/04/2017.
 */
//~~~database variables~~~
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0&authSource=admin";

var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/shopAdoc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

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
//module.exports.connectDb = connectDb;
//module.exports.dbResponse = dbResponse;