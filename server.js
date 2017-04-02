var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    name    : String,
    email   : String,
    message : String
});

var Contact = mongoose.model('Contact', Schema);

mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.post('/add_contact', function (req, res) {
    var contact = new Contact( req.body );
    contact.save(function (err) {
        res.json(200, contact);
    });
})

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});


// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
