//~~~~~~~DOCTORS~~~~~~~//
db.createCollection("doctors",
    { validator: { $and:
        [
            { name: {$type: "string"}},
            { title: { $type: "string" } },
            { address: { $type: "string" } }, //might add business name as well
            { avgMinCost: { $type: "double" } },
            { avgMaxCost: { $type: "double" } },
            { bulkBill: { $in: ["yes","no"] } },
            { averageRating: { $type: "double"} },
            { reviewCount: { $type: "double" } },
            { photo: { $type: "string" } },
            { description: { $type: "string" } }
        ]
    }}
);

db.doctors.createIndex({"name":1},{unique:true});
db.doctors.createIndex({"name":"text","address":"text","title":"text"});

//~~~~~~~USERS~~~~~~~//
db.createCollection( "users",
    { validator: { $and:
        [
            { _id: { $in: [/@gmail\.com$/, /@mongodb\.com$/] } },
            { name: {$type: "string"}},
            { phone: { $type: "string" } }

        ]
    }}
);

//~~~~~~~REVIEWS~~~~~~~//
db.createCollection( "reviews",
    { validator: { $and:
        [
            { doctorName: {$type: "string" }},
            { rating:     {$type: "string"}},
            { reviewerName:{$type: "string"}},
            { reviewerPhotoURL:{$type: "string"}},
            { comment:    {$type: "string"}}
        ]
    }}
);
db.reviews.createIndex({"doctorName":"text"});

//~~~AVALIBILITY~~~//
db.createCollection( "doctorAvailability",
    { validator: { $and:
        [
            { doctorName: {$type: "string"}},
            { day: {$type: "date"}}//,
            //{ times: { $type: "array" }}
        ]
    }}
);
db.doctorAvailability.createIndex({"doctorName":"text"});

//~~~~~~~ Testing and Notes ~~~~~~~~//
/*db.createCollection( "contacts",
    { validator: { $and:
        [
            { _id: { $in: [/@gmail\.com$/, /@mongodb\.com$/] } },
            { name: {$type: "string"}},
            { phone: { $type: "string" } }
        ]
    }}
);*/

//db.contacts.createInxex({name:1},{unique : true});

//$and = logical and
//$regex = regular expression
//$in = matches values with specified array
//%type = goto https://docs.mongodb.com/manual/reference/operator/query/type/#op._S_type


//delete collections with
//db.collection.drop()
//ie: "db.contacts.drop()"