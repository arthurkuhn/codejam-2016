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

require("./models/movie.js");
require("./models/user.js");
// configuration ===============================================================
mongoose.connect(database.remoteUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)


app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get("/choose-likes"), function(req,res){
  res.render('views/pages/movies.ejs', {
      articles: articles
  });
}

app.post("/postMovie",function(req,res){
  if(!req.body){
      return res.send({"status": "error", "message": "missing a parameter"});
  }
  var Movie = mongoose.model("Movie")
  Movie.findOne({
      Title: req.body.Title
  }, function(err, docs) {
      if (docs) {
          res.send({"status": "error", "message": "This Movie Already Exists"});
      } else {
          var movie = new Movie(req.body);
          movie.save(function(err, result) {
              if (err) {
                res.send({"status": "error", "message": "Could not save to DB"});
                console.log(err);
              }
              if (result) {
                  res.send({"status": "OK", "message": "  "});
                  console.log("Movie saved successfully");
              }
          });
      }
  });
});

app.post("/user/:user/movies/set", function(req, res){
    var name = req.params.user;
    var User = mongoose.model("Users");

    var movies = req.params.movies.split(" ");

    User.findOne({'name':name}, 'movies', function(err,user){
        user.movies = movies;
        user.save(function(err, user){
            if(err) return console.error(err);
            if(movies < 1){
                res.write("false");
            }else{
                res.write("true");
            }

        });
    });
});

app.post("/user/:user/genres/set", function(req, res){
    var name = req.params.user;
    var User = mongoose.model("Users");

    var genres = req.params.genres.split(" ");

    User.findOne({'name':name}, 'genres', function(err,user){
        user.genres = genres;
        user.save(function(err, user){
            if(err) return console.error(err);
            if(genres < 1){
                res.write("false");
            }else{
                res.write("true");
            }
        });
    });

});
app.get("/user/:user/genres", function(req,res){
    var name = req.params.user
    var User = mongoose.model("Users");
    User.findOne({'name':name}, 'name movies genres', function(err, user){
        if(!err){
            if(user==null){
                res.redirect("/");
                return;
            }else{
                renderGenreList(res, user);
            }
        }else{
            return console.error(err);
        }
    });
});
app.get("/user/:user/movies", function(req,res){
    var name = req.params.user;
    var User = mongoose.model("Users");
    User.findOne({'name':name}, 'name movies genres', function(err, user){
        if(!err){
            if(user==null){
                res.redirect("/");
                return;
            }else{
                renderMovieList(res, user);
            }
        }else{
            return console.error(err);
        }
    });
});
app.get("/user/:user", function(req,res){
    var name = req.params.user;

    var User = mongoose.model("Users");

    User.findOne({'name':name}, 'name movies genres', function(err, user){
        if(!err){
            if(user==null){
                var newUser = new User({name:name, movies:[], genres:[]});
                newUser.save(function(err, newUser){
                    if(err) return console.error(err);
                    res.redirect("/user/"+name+"/genres");
                });

            }else{
                if(user.genres.length < 1){
                    res.redirect("/user/"+name+"/genres");
                }else
                if(user.movies.length < 5){
                    res.redirect("/user/"+name+"/movies");
                }else{
                    res.render('pages/showUser.ejs', {
                        user: user
                    });
                }
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

});

function renderMovieList(res, user){
    //TODO load top movies and pass them to view
    var Movie = mongoose.model("Movie");

    Movie.find({},null,{limit:20, sort:{
        "tomatoUserMeter":1
    }},function(req,movies){
        res.render('pages/selectMovies.ejs', {
            user: user,
            movieList: movies
        });
    });


}
function renderGenreList(res, user){
    console.log(user.name);
    res.render('pages/selectGenres.ejs', {
        user: user,
        genres: ["Action", "Adventure", "Animation",
        "Biography", "Comedy", "Crime", "Fantasy",
        "Game-Show", "History", "Horror", "Music", "Musical",
        "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi",
        "Sitcom", "Sports", "Talk-Show", "Thriller", "War", "Western"]
    });
}
// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
