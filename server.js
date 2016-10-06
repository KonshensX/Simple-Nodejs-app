var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var busboy = require('connect-busboy');


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

app.set('view engine', 'ejs');

//Middleware
app.use(busboy());
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
    connection.query("INSERT INTO messages values (?, ?, ?, ?)", [3, name, email, message], function(err) {
       if (err) throw err;
    });
    connection.end();
    response.render('pages/contact', {message: "Your message was successfully sent to the support"});
});

app.get('/profile', function(request, response) {
    response.render('pages/profile', {title: "Profile page"});
});

app.post('/profile', function(request, response) {
    var name = request.body.fullname;
    var phone = request.body.phone;
    var email = request.body.email;
    var about = request.body.about;
    var fstream;

    request.pipe(request.busboy);
    request.busboy.on('file', function(fieldname, file, filename){
        console.log("Uploading "+ filename);
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function(){
            response.redirect('/profile');
        })

    });

    response.render('pages/profile', {
        fullname: name,
        phone: phone,
        email: email,
        about: about
    })
});


//Sever side bullshit is going to be here , this sentence doesn't make any sense please ignore it
var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("This app is listening at port %s %s ", host, port)
});