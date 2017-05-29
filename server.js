var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var path = require('path');
var compression = require('compression');
var helmet = require('helmet')

// *** Database setup ***
var Schema = new mongoose.Schema({
    email   : String,
});
var url = process.env.DEV ? 'mongodb://localhost/telebuddies' : process.env.MONGODB_URI;
mongoose.connect(url, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var Contact = mongoose.model('Contact', Schema);

// *** Express setup ***
var app = express();
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));

// *** Routes ***
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/about', function(req, res) {
  res.render('index', {about: true});
});

app.get('/faq', function(req, res) {
  res.render('index', {faq: true});
});

app.post('/add_contact', function (req, res) {
    Contact.count({email: req.body.email}, function(err, c) {
        if (err) {
            res.render('index', {error: true})
        }
        else if (c > 0) {
            res.render('index', {duplicated: true, email: req.body.email});
        } else {
            var contact = new Contact( req.body );
            contact.save(function (err) {
                res.render('index', {success: true});
            });
        }
    });
});


// *** Initialize the app. ***
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
