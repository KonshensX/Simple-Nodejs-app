var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

app.set('view engine', 'ejs');

//Middleware
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes are going to be here
/*Other stuff like GET are POST, DELETE ..*/
/*
* app.post('/', function(){)
* */
app.get('/', function(request, response) {
    response.render('pages/index', {test: 'this text is passed from the server.js file'})
});

app.get('/contact', function(request, response) {
    response.render('pages/contact', {test: "This is the contact us page"});
});

app.post('/contact', function(request, response){
   connection.connect();
    var name = request.body.name;
    var email = request.body.email;
    var message = request.body.message;
    connection.query("INSERT INTO messages values (?, ?, ?, ?)", [2, name, email, message], function(err) {
       if (err) throw err;
    });
    connection.end();
    response.render('pages/contact', {message: "Your message was successfully sent to the support"});
});
//Sever side bullshit is going to be here , this sentence doesn't make any sense please ignore it
var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("This app is listening at port %s %s ", host, port)
    console.log("This is some powerful shit");
});