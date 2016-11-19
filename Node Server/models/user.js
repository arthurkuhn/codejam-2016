var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:  { type: String, required: true, unique: true},
    meta: {
      age: Number,
      gender: String
    },
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function(next){
    var currentDate = new Date();
    this.updated_at = currentDate;
    if(!this.created_at){
        this.created_at = currentDate;
    }
    next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;
