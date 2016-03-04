var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    Id: String,
    Username: String,
    Password: String,

    Name: String,
    Email: String,

    Meta: {
        Created: { type: Date, default: Date.now },
        LastVisited: Date,
    }
});

mongoose.model('User', userSchema);

User = mongoose.model('User', userSchema);

module.exports.User = User;