//var t1 = {seven:1,seventhirty:1  ,eight:1,eightthirty:1   ,nine:1,ninethirty:1   ,ten:1,tenthirty:1,   eleven:1,eleventhirty:1,   twelve:1,twelvethirty:1   ,thirteen:1,thirteenthirty:1   ,fourteen:1,fourteenthirty:1   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1};
var av1 = {doctorName: "Dr. Perry Cox",day: new Date('2017-05-31'), times: {seven:1,seventhirty:1  ,eight:1,eightthirty:1   ,nine:1,ninethirty:1   ,ten:1,tenthirty:1,   eleven:1,eleventhirty:1,   twelve:1,twelvethirty:1   ,thirteen:1,thirteenthirty:1   ,fourteen:1,fourteenthirty:1   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};
var av2 = {doctorName: "Dr. Perry Cox",day: new Date('2017-06-01'), times: {seven:1,seventhirty:0  ,eight:0,eightthirty:0   ,nine:1,ninethirty:1   ,ten:1,tenthirty:1,   eleven:0,eleventhirty:0,   twelve:1,twelvethirty:1   ,thirteen:1,thirteenthirty:0   ,fourteen:1,fourteenthirty:0   ,fifteen:1,fifteenthirty:0   ,sixteen:1,sixteenthirty:1}};
var av3 = {doctorName: "Dr. Cameron Weber",day: new Date('2017-05-31'), times: {seven:1,seventhirty:1  ,eight:1,eightthirty:1   ,nine:1,ninethirty:1   ,ten:1,tenthirty:0,   eleven:1,eleventhirty:1,   twelve:1,twelvethirty:1   ,thirteen:1,thirteenthirty:1   ,fourteen:1,fourteenthirty:1   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};
var av4 = {doctorName: "Dr. Cameron Weber",day: new Date('2017-06-01'), times: {seven:1,seventhirty:1  ,eight:0,eightthirty:0   ,nine:0,ninethirty:0   ,ten:1,tenthirty:0,   eleven:1,eleventhirty:0,   twelve:0,twelvethirty:0   ,thirteen:0,thirteenthirty:0   ,fourteen:1,fourteenthirty:0   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};
var av5 = {doctorName: "Dr. Bob Kelso",day: new Date('2017-05-31'), times: {seven:0,seventhirty:1  ,eight:1,eightthirty:1   ,nine:1,ninethirty:1   ,ten:1,tenthirty:1,   eleven:1,eleventhirty:1,   twelve:1,twelvethirty:1   ,thirteen:1,thirteenthirty:1   ,fourteen:1,fourteenthirty:1   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};
var av6 = {doctorName: "Dr. Bob Kelso",day: new Date('2017-06-01'), times: {seven:1,seventhirty:1  ,eight:0,eightthirty:0   ,nine:0,ninethirty:0   ,ten:1,tenthirty:1,   eleven:1,eleventhirty:0,   twelve:0,twelvethirty:0   ,thirteen:0,thirteenthirty:0   ,fourteen:1,fourteenthirty:0   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};
var av7 = {doctorName: "Dr. Chris Wilkinson",day: new Date('2017-05-31'), times: {seven:1,seventhirty:0  ,eight:1,eightthirty:1   ,nine:1,ninethirty:1   ,ten:1,tenthirty:1,   eleven:1,eleventhirty:1,   twelve:1,twelvethirty:1   ,thirteen:1,thirteenthirty:1   ,fourteen:1,fourteenthirty:1   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};
var av8 = {doctorName: "Dr. Chris Wilkinson",day: new Date('2017-06-01'), times: {seven:1,seventhirty:1  ,eight:0,eightthirty:0   ,nine:0,ninethirty:0   ,ten:1,tenthirty:1,   eleven:1,eleventhirty:0,   twelve:0,twelvethirty:0   ,thirteen:0,thirteenthirty:0   ,fourteen:1,fourteenthirty:0   ,fifteen:1,fifteenthirty:1   ,sixteen:1,sixteenthirty:1}};


var availability = [av1,av2,av3,av4,av5,av6,av7,av8];
for (var i=0; i<availability.length; i++) {
    try {
        db.doctorAvailability.insertOne(availability[i]);
    } catch (e) {
        print(e);
    }
}