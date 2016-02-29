var mongoose = require('mongoose');

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