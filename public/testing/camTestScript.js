/**
 * Created by Cameron on 29/04/2017.
 */


function queryDb(){
    httpGetAsync("/server",callBack)
}

function httpGetAsync(theUrl, res){
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
}

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});