// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
//mongoose.connect("mongodb://localhost/USERS");
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(database.remoteUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.set('view engine', 'ejs');


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
    var name = req.param("user");

    var User = mongoose.model("Users");

    User.findOne({'name':name}, 'name, gender, age', function(err, user){
        if(!err){
            if(user==null){
                newUser = new User({name:name, movies:[null]});
                newUser.save(function(err, newUser){
                    if(err) return console.error(err);
                    res.render('pages/selectMovies.ejs', {
                        user: newUser
                    });
                });

            }else{
                res.render('pages/showUser.ejs', {
                    user: user
                });
            }
        }else{

        }
    });


    //for now, simply creates a new user
});

//verify mongodb connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    var usersSchema = mongoose.Schema({
        name: String,
        movies: [String]
    });

    mongoose.model('Users', usersSchema);

});


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
