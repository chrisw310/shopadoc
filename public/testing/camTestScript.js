/**
 * Created by Cameron on 29/04/2017.
 */

var socket = io.connect('http://' + window.location.hostname); //works for localhost
socket.on('connectedToServer', function (data) {
    console.log(data);
    socket.emit('clientConnect', 'Client Connected!');
});

socket.on('contacts', function (data) {
    console.log(data[0]);
    console.log(data[1].name);

    HTMLstring = '<tr><th>Name:</th><th>Email:</th><th>Phone:</th></tr>';

    for(var i=0; i<data.length; i++){
        HTMLstring += '<tr>' +
                        '<td>' + data[i].name + '</td>' +
                        '<td>' + data[i]._id + '</td>' +
                        '<td>' + data[i].phone + '</td>' +
                    '</tr>';
    }

    document.getElementById('contactsTable').innerHTML = HTMLstring;
});

socket.on('addContact',function(msg){
    document.getElementById("contactErrorText").textContent = msg;
    if(msg === 'ContactAdded'){
        getContacts();
    }
});

function getContacts(){
    //request the contacts from the database
    socket.emit('searchContacts','requestedContacts');
}

function addContact(){
    var nameStr = document.getElementById('nameTextArea').value;
    var emailStr = document.getElementById('emailTextArea').value;
    var phoneStr = document.getElementById('phoneTextArea').value;

    var errText = document.getElementById("contactErrorText");
    if(!nameStr || nameStr.length === ''){
        errText.textContent = "Name Required"
    }else if(!emailStr || emailStr.length === ''){
        errText.textContent = "Email Required"
    }else if(!phoneStr || phoneStr.length === ''){
        errText.textContent = "Phone Required"
    }else{
        errText.textContent = null;
        socket.emit('addContact',{name: nameStr, email: emailStr, phone: phoneStr});
    }
}


//old http request methods
/*function httpGetAsync(theUrl, res){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            res(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function callBack(string){
    console.log('callback');
    console.log(string);
}*/