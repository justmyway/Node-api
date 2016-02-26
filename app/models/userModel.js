var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    Id: String,
    Name: String,

    Meta: {
        Created: Date,
        LastVisited: Date,
    }
});

module.exports = mongoose.model('User', userModel);