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


var genres = ["Action", "Adventure", "Animation",
    "Biography", "Comedy", "Crime","Documentary","Drama","Family" , "Fantasy",
    "Game-Show", "History", "Horror", "Music", "Musical",
    "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi",
    "Sitcom", "Sport", "Talk-Show", "Thriller", "War", "Western"];

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
//endpoint to post a movie to the database
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
//endpoint to set a users movie preferences
//movies should be sent as a comma separated list
app.post("/user/:user/movies/set", function(req, res){
    var name = req.params.user;
    var User = mongoose.model("Users");

    var movies = req.body.movies.split(",");
    //find user and save movies.
    User.findOne({'name':name}, 'movies', function(err,user){
        user.movies = movies;
        user.save(function(err, user){
            if(err) res.sendStatus(400);
            if(movies.length < 1){
                res.sendStatus(400);
            }else{
                res.sendStatus(200);
            }

        });
    });
});
//Endoint to set the genre preference for a user
//Genres should be sent as a comma seperated list
app.post("/user/:user/genres/set", function(req, res){
    var name = req.params.user;
    var User = mongoose.model("Users");

    var genres = req.body.genres.split(",");
    //find user and save genres.
    User.findOne({'name':name}, 'genres', function(err,user){
        user.genres = genres;
        user.save(function(err, user){
            if(err) res.sendStatus(400);
            if(genres.length < 1){
                res.sendStatus(400);
            }else{
                res.sendStatus(200);
            }
        });
    });

});
//Page used to set the genres
//Displays a list of all the imdb genres
app.get("/user/:user/genres", function(req,res){
    var name = req.params.user
    var User = mongoose.model("Users");
    User.findOne({'name':name}, 'name movies genres', function(err, user){
        if(!err){
            if(user==null){
                //if user doesn't exist, redirect to home page
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
//Page used to set movies
//Displays a list of personalized movies to choose from
app.get("/user/:user/movies", function(req,res){
    var name = req.params.user;
    var User = mongoose.model("Users");
    User.findOne({'name':name}, 'name movies genres', function(err, user){
        if(!err){
            if(user==null){
                //if user doesn't exist, redirect to home page
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
//User profile page.
//Will redirect to /genres or /movies depending on setup proccess
//If setup is finished, will display movie suggestions
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
                //check to see if user has selected at least one genre
                if(user.genres.length < 1){
                    res.redirect("/user/"+name+"/genres");
                }else
                    //check to see if user has selected at least 5 movies
                if(user.movies.length < 5){
                    res.redirect("/user/"+name+"/movies");
                }else{
                    //Called when genres and movies pass the checked
                    renderRecomendedMovies(res, user);
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
//Render the movie list for the selectMovie page.
//Movies are based on the genres selected, rating across platforms and popularity.
function renderMovieList(res, user){
    //TODO load top movies and pass them to view
    var Movie = mongoose.model("Movie");
    var bestMovies = []; //array to contain the final movie list
    var movieLimit = 40; //limit of movies to display
    //Find all movies, sort by number of imdb votes
    Movie.find({},null,{sort:{
        "imdbVotes":1
    }},function(req,movies){
        for(var i=0; i < movies.length; i++){
            //get movie genres
            var mGenres = movies[i].Genre;

            var matchedGenres = 0; //keep track of how many genres match

            var checked = false; //has movie already been checked by user

            var animeCheck = false;

            for(var j=0; j < mGenres.length; j++) {
                var mGenre = mGenres[j].trim().toLowerCase(); //movie genre
                if(mGenre == "animation"){
                    animeCheck = true;
                }
                //go through user genres
                for (var k = 0; k < user.genres.length; k++) {
                    var genre = user.genres[k];
                    if(genre == "animation"){
                        animeCheck = false;
                    }
                    //check to see if user genre matches movie genre
                    if(genre.toLowerCase() == mGenre){
                        matchedGenres++;
                    }
                }
            }
            //go through user movies to see if it's already checked
            for(var k = 0; k < user.movies.length; k++){
                if(user.movies[k].toLowerCase() == movies[i].Title.toLowerCase()){
                    checked = true;
                }
            }
            //Assign a genre score to genres based on how many user genres matched the movie genres.
            //Designed to punish movies that have too many genres / that are not specific enough
            var prob = matchedGenres/mGenres.length;
            var genreScore = prob*10-(user.genres.length-matchedGenres)*2;

            //Collect different ratings and average them out
            var ratings = [];
            var imdbRating = parseInt(movies[i].imdbRating);
            var tomaRating = parseInt(movies[i].tomatoRating);
            var tomaRating_user = parseInt(movies[i].tomatoUserRating)
            var criticUsers = parseInt(movies[i].userscore);
            if(!isNaN(criticUsers)){
                ratings.push(criticUsers);
            }
            if(!isNaN(imdbRating)){
                ratings.push(imdbRating);
            }
            if(!isNaN(tomaRating)){
                ratings.push(tomaRating);
            }
            if(!isNaN(tomaRating_user)){
                ratings.push(tomaRating_user);
            }


            var average = 0;



            if(ratings.length > 0){
                for(var r=0; r < ratings.length; r++){
                    average+=ratings[r];
                }
                average = average / ratings.length;
            }

            // Assign rating based on how popular it is
            var popularRating = (parseInt(movies[i].imdbVotes)/1000000)*10;

            //Makes a score based on the genre score, average rating and popular rating
            var score = genreScore + average + popularRating;

            if(animeCheck){
                score -= 6;
            }

            //Bump the checked movies up so that they are at the top of the page
            if(checked)
                score+=60;

            //Put movie in array if it scores better than another movie
            if(bestMovies.length == 0){
                bestMovies.push({movie:movies[i], score:score, checked:checked})
            }else {
                var inserted = false;
                for (var j = 0; j < bestMovies.length; j++) {
                    if (bestMovies[j].score < score) {
                        bestMovies.splice(j, 0, {movie:movies[i], score:score, checked:checked});
                        inserted = true;
                        //Remove excess movies
                        while(bestMovies.length >movieLimit){
                            bestMovies.pop();
                        }
                        break;
                    }
                }
                if(!inserted && bestMovies.length < movieLimit){
                    bestMovies.push({movie:movies[i], score:score, checked:checked});
                }
            }
        }


        res.render('pages/selectMovies.ejs', {
            user: user,
            movieList: bestMovies
        });
    });
}
//Render the list of genres
function renderGenreList(res, user){
    console.log(user.name);
    //list of genres from imdb

    //final array. Contains if the user already checked it
    var checkedGenres = [];
    for(var i=0; i < genres.length; i++){
        var checked = false;
        for(var j=0; j < user.genres.length; j ++){
            console.log(user.genres[j].toLowerCase().trim()+" "+genres[i].toLowerCase().trim());
            //check if user checked the genre previously
            if(user.genres[j].toLowerCase().trim() == genres[i].toLowerCase().trim()) {
                checked = true;
                break;
            }
        }
        checkedGenres.push({genre:genres[i], checked:checked});
        console.log(i);
    }
    res.render('pages/selectGenres.ejs', {
        user: user,
        genres:checkedGenres,
        newUser:(user.genres.length==0)

    });
}
//Render final list of remcomended movies
//very similar to renderMovieList() but has additional ratings such as actors
function renderRecomendedMovies(res, user){
    var Movie = mongoose.model("Movie");



        Movie.find({"Title":{$in: user.movies}}, function(err, movies) {
            var actors = {};
            var genres = {};

            for(var j=0; j < movies.length; j++){
                var movie = movies[j];

                if(movie!=null) {
                    var mActors = movie["Actors"].split(',');
                    var mGenres = movie["Genre"];


                    for (var k = 0; k < mActors.length; k++) {
                        var actor = mActors[k].trim();
                        if (isNaN(actors[actor])) {
                            actors[actor] = 1;
                        } else {
                            actors[actor]++;
                        }
                    }

                    for (var k = 0; k < mGenres.length; k++) {
                        var genre = mGenres[k].trim();
                        if (isNaN(genres[genre])) {
                            genres[genre] = 1;
                        } else {
                            genres[genre]++;
                        }
                    }
                }
            }
            renderMovieRecommendations(res, user,actors, genres);
          });
}

function renderMovieRecommendations(res,user, actorList, genreList){


    var genreNums = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i < genres.length; i++){
        var g = genreList[genres[i]];
        if(g)
            genreNums[i] = g;
    }
   // console.log(genreNums);
    var Movie = mongoose.model("Movie");

            Movie.find({"Title": {$in: user.movies}}, null, {}, function (req, movies1) {
                var cats = [0,0,0,0,0,0,0,0,0,0];
                for(var i=0; i < movies1.length; i++){
                    var kmen = movies1[i].Kmeans;
                    cats[kmen]++;
                }

                var index=0;

                for(var i=0; i < cats.length; i++){
                    if(cats[i] > cats[index]){
                        index = i;
                    }
                }
                console.log("best k is "+index);
                Movie.find({"Kmeans": index}, null, {}, function (req, movies1) {

                    var rMovies = [];
                    var dNum = 0;
                    for(var r =0; r < 5; r++){
                        if(dNum > 10)
                            break;
                        var num = Math.random() * movies1.length;
                        var dupe = false;
                        for(var j=0; j < rMovies.length; j++){
                            if(rMovies[j].Title == movies1[Math.floor(num)].Title){
                                dupe = true;
                            }
                        }
                        for(var j=0; j < user.movies.length; j++){
                            if(user.movies[j] == movies1[Math.floor(num)].Title){
                                dupe = true;
                            }
                        }
                        if(dupe){
                            r--;
                            dNum++;
                        }else{
                            var mv = movies1[Math.floor(num)];
                            rMovies.push(mv);
                        }
                    }

                    res.render('pages/showUser.ejs', {
                        user: user,
                        movieList: rMovies
                    });
                });
    });
}

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
