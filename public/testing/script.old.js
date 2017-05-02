function connectDb(){
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