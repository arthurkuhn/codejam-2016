// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
//var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
//mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.set('view engine', 'ejs');

//var db = mongoose.connect('mongodb://');


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/choose-likes"), function(req,res){
  res.render('views/pages/movies.ejs', {
      articles: articles
  });
}

app.post("/postMovie",function(req,res){
  console.log(req);
  console.log(res);
  res.sendStatus(200);
});

app.get("/openUser", function(req,res){
    //TODO check database for user
    res.render('pages/createUser.ejs', {
        name: req.param("user")
    });
    //for now, simply creates a new user
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
