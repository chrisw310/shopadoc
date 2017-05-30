var review1 = {doctorName: "Dr. Perry Cox", rating: '5', reviewerName: "Cameron Weber", comment: "", reviewerPhotoURL: "https://lh3.googleusercontent.com/-Zd9NUf9yTZU/AAAAAAAAAAI/AAAAAAAAApM/Ok6pxXfd-aM/s96-c/photo.jpg"};
var review2 = {doctorName: "Dr. Bob Kelso", rating: '1', reviewerName: "Cameron Weber", comment: "", reviewerPhotoURL: "https://lh3.googleusercontent.com/-Zd9NUf9yTZU/AAAAAAAAAAI/AAAAAAAAApM/Ok6pxXfd-aM/s96-c/photo.jpg"};
var review3 = {doctorName: "Dr. Harry Hoyland", rating: '5', reviewerName: "Cameron Weber", comment: "", reviewerPhotoURL: "https://lh3.googleusercontent.com/-Zd9NUf9yTZU/AAAAAAAAAAI/AAAAAAAAApM/Ok6pxXfd-aM/s96-c/photo.jpg"};
var review4 = {doctorName: "Dr. Chris Wilkinson", rating: '5', reviewerName: "Cameron Weber", comment: "", reviewerPhotoURL: "https://lh3.googleusercontent.com/-Zd9NUf9yTZU/AAAAAAAAAAI/AAAAAAAAApM/Ok6pxXfd-aM/s96-c/photo.jpg"};
var review5 = {doctorName: "Dr. Chris Wilkinson", rating: '5', reviewerName: "Anonymous", comment: "Very friendly, and very quick! A++", reviewerPhotoURL: "../../images/me.jpg"};
var review6 = {doctorName: "Dr. Harry Hoyland", rating: '2', reviewerName: "Anonymous", comment: "VAbysmal Surgery. Never got my money back", reviewerPhotoURL: "../../images/me.jpg"};
var review7 = {doctorName: "Dr. Cameron Weber", rating: '1', reviewerName: "Anonymous", comment: "Terrible Doctor. Bad Service. Very rude. . Never again. Do not do business with this man.", reviewerPhotoURL: "../../images/me.jpg"};

var reviews = [review1,review2,review3,review4,review5,review6,review7];
for (var i=0; i<reviews.length; i++) {
    try {
        db.reviews.insertOne(reviews[i]);
    } catch (e) {
        print(e);
    }
}