/**
 * Created by Cameron on 22/04/2017.
 */
//~~~database variables~~~
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0&authSource=admin";

var uri = "mongodb://infs3202dbadmin:wrQn3qmF1x7inzgn@cluster0-shard-00-00-mvxrs.mongodb.net:27017,cluster0-shard-00-01-mvxrs.mongodb.net:27017,cluster0-shard-00-02-mvxrs.mongodb.net:27017/shopAdoc?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";


function connectDb() {
    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        console.log('connected to the databse');
        findCollections(db, function() {
            db.close();
            console.log('connection closed');
        });
    });
    //MongoClient.close();
    //console.log('connection closed');
}

var findCollections = function(db, callback) {
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

var createValidatedCollection = function(db, callback) {
    db.createCollection("contacts",
        {
            'validator': { '$or':
                [
                    { 'phone': { '$type': "string" } },
                    { 'email': { '$regex': /@mongodb\.com$/ } },
                    { 'status': { '$in': [ "Unknown", "Incomplete" ] } }
                ]
            }
        },
        function(err, results) {
            assert.equal(err, null);
            console.log("Collection created.");
            callback();
        }
    );
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
}

//export the functions in this script to be used by routes.js
module.exports.connectDb = connectDb;
module.exports.dbResponse = dbResponse;