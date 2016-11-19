var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = mongoose.Schema({
    name: String,
    movies: [String],
    genres: [String]
});

mongoose.model('Users', usersSchema);

