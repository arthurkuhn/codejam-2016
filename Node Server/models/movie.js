var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    "Title": {
        type: String,
        required: true,
        unique: true
    },
    "Year": String,
    "Rated": String,
    "Released": String,
    "Runtime": String,
    "Genre": String,//"Crime, Thriller",
    "Director": String,
    "Writer": String, //"George Clayton Johnson, Jack Golden Russell, Harry Brown, Charles Lederer, Ted Griffin (screenplay)",
    "Actors": String, //"George Clooney, Cecelia Ann Birt, Paul L. Nolan, Carol Florence",
    "Plot": String,
    "Language": String,
    "Country": String,
    "Awards": String,
    "Poster": String,
    "Metascore": String,
    "imdbRating": String,
    "imdbVotes": String,
    "imdbID": String,
    "Type": String,
    "tomatoMeter": String,
    "tomatoImage": String,
    "tomatoRating": String,
    "tomatoReviews": String,
    "tomatoFresh": String,
    "tomatoRotten": String,
    "tomatoConsensus": String,
    "tomatoUserMeter": String,
    "tomatoUserRating": String,
    "tomatoUserReviews": String,
    "tomatoURL": String,
    "DVD": String,
    "BoxOffice": String,
    "Production": String,
    "Website": String,
    "Response": Boolean
});


movieSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
