/**
 * Created by Cameron on 29/05/2017.
 */


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shopadocinfs3202@gmail.com',
        pass: 'thisIsajoke'
    }
});

function sendEmail(bookingData){
    var times = {'seven':'7:00am','seventhirty':'7:30am','eight':'8:00am','eightthirty':'8:30am','nine:':'9:00am','ninethirty':'9:30am'
        ,'ten':'10:00am','tenthirty':'10:30am','eleven':'11:00am','eleventhirty':'11:30am','twelve':'12:00pm','twelvethirty':'12:30pm'
        ,'thirteen':'1:00pm','thirteenthirty':'1:30pm','fourteen':'2:00pm','fourteenthirty':'2:30pm','fifteen':'3:00pm'
        ,'fifteenthirty':'3:30pm','sixteen':'4:00pm','sixteenthirty':'4:30pm'};
    var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    bookingData.day = new Date(bookingData.day);
    var bookingTime = times[bookingData.time] + ', ' +
    days[bookingData.day.getDay()] +' ' + bookingData.day.getDate() + ' ' +
    months[bookingData.day.getMonth()] +' '+ bookingData.day.getFullYear();

    var message = 'Hello\nThis is an automated message confirming your booking at ShopADoc.me\n';
    message += 'Booking Details:\n';
    message += 'Doctor: ' + bookingData.doctorName + '\n';
    message += 'Time: ' + bookingTime;
    var mailOptions = {
        from: 'shopadocinfs3202@gmail.com',
        to: bookingData.clientEmail,
        subject: 'ShoADoc.me Booking Confirmation',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.sendEmail = sendEmail;
