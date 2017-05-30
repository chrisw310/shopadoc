
var contact1 = { _id: "cameron@mongodb.com", name: "Cameron Weber", phone: "04"};
var contact2 = { _id: "cam@mongodb.com", name: "Cameron Weber", phone: "123456"};
var contact3 = { _id: "doctor@gmail.com" , name: "DoctorRandom", phone: "78965"};

var contacts = [contact1, contact2, contact3];
/*for (var i=0; i<contacts.length; i++) {
    try {
        db.contacts.insertOne(contacts[i]);
    } catch (e) {
        print(e);
    }
}*/

var des1 = "Hello, I am Cameron Weber";;
var d1 = {name: "Dr. Cameron Weber", title: "General Practitioner", address: "15 Morrow St, Taringa, QLD", avgMinCost: 50, avgMaxCost: 200, bulkBill: "yes", averageRating: 3.5, reviewCount: 14, photo: "cameron.jpg",description:des1};
var des2 = "Hello, I am Harry Hoyland";
var d2 = {name: "Dr. Harry Hoyland", title: "General Practitioner", address: "66 Station Rd, Indooroopilly, QLD", avgMinCost: 99, avgMaxCost: 139, bulkBill: "no", averageRating: 5, reviewCount: 4, photo: "harry.jpg",description:des2};
var des3 = "G'day my name's Chris and I am the best brain surgeon in Bishop Street, St Lucia. Successful brain surgery or you get your money back.";
var d3 = {name: "Dr. Chris Wilkinson", title: "General Practitioner", address: "80 Stamford Rd, Indooroopilly, QLD", avgMinCost: 49, avgMaxCost: 99, bulkBill: "yes", averageRating: 2, reviewCount: 97, photo: "chris.jpg",description:des3};
var des4 = "I don’t know if they taught you this in the land of fairies and puppy-dog tails, where you obviously, if not grew up then at least spent most of your summers, but you’re in the real world now. Nnnnn-kay?";
var d4 = {name: "Dr. Perry Cox", title: "Cardiologist", address: "4/400 Gregory Terrace, Spring Hill, QLD", avgMinCost: 400, avgMaxCost: 40, bulkBill: "yes", averageRating: 5, reviewCount: 40, photo: "perry.jpg",description:des4};
var des5 = "Bob Kelso. How you doing? ";
var d5 = {name: "Dr. Bob Kelso", title: "Allergist", address: "144 Indooroopilly Rd, Taringa, QLD", avgMinCost: 200, avgMaxCost: 100, bulkBill: "no", averageRating: 1, reviewCount: 400, photo: "kelso.jpg",description:des5};


/*var doctors = [d1, d2, d3, d4, d5];
for (var i=0; i<doctors.length; i++) {
    try {
        db.doctors.insertOne(doctors[i]);
    } catch (e) {
        print(e);
    }
}*/