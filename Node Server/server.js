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
  console.log(req);
  console.log(res);
  res.sendStatus(200);
});

app.post("/setUserFilms", function(req, res){

});

app.get("/openUser", function(req,res){
    var name = req.param("user");

    var User = mongoose.model("Users");

    User.findOne({'name':name}, 'name, movies, genres', function(err, user){
        if(!err){
            if(user==null){
                var newUser = new User({name:name, movies:[], genres:[]});
                newUser.save(function(err, newUser){
                    if(err) return console.error(err);
                    renderGenreList(res, newUser);
                });

            }else{
                if(user.genres.length < 1){
                    renderGenreList(res,user);
                }else
                if(user.movies.length < 5){
                    renderMovieList(res, user);
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
    var usersSchema = mongoose.Schema({
        name: String,
        movies: [String],
        genres: [String]
    });

    mongoose.model('Users', usersSchema);

});

function renderMovieList(res, user){
    //TODO load top movies and pass them to view
    res.render('pages/selectMovies.ejs', {
        user: user,
        movieList: [{title:"Band of Brothers", img:"https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3ODc2ODc0M15BMl5BanBnXkFtZTYwMjgzNjc3._V1_.jpg", id:""},
            {title:"Planet Earth", img:"https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3ODc2ODc0M15BMl5BanBnXkFtZTYwMjgzNjc3._V1_.jpg", id:""},
            {title:"Breaking bad", img:"https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3ODc2ODc0M15BMl5BanBnXkFtZTYwMjgzNjc3._V1_.jpg", id:""},
            {title:"Game of thrones", img:"", id:""}]
    });
}
function renderGenreList(res, user){
    res.render('pages/selectGenres.ejs', {
        user: user,
        genres: ["Action", "Adventure", "Comedy", "Animation",
        "Biography", "Comedy", "Crime", "Fantasy",
        "Game-Show", "History", "Horror", "Music", "Musical",
        "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi",
        "Sitcom", "Sports", "Talk-Show", "Thriller", "War", "Western"]
    });
}
// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
