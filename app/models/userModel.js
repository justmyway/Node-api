var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    Username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20,
        validate: {
            validator: function(v) {
                return /[\w.#_-]+/g.test(v);
            },
            message: '\'{VALUE}\' is geen geldige gebruikersnaam'
        }
    },
    Password: {
        type: String,
        required: true
    },

    Name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 50,
        validate: {
            validator: function(v) {
                return /[\w._%+-]+@[\w.-]+.[a-z]{2,}/.test(v);
            },
            message: '\'{VALUE}\' is geen geldig email adres'
        }
    },

    Roles: [{type: String}],

    Terms: {
        v1: {
            accepted: Boolean,
            date: Date
        }
    },

    Meta: {
        Created: Date,
        LastVisited: Date
    }
});

userSchema.methods.hasAnyRole = function(roles) {
    if (this.Roles.containsAny(roles)) {
        return true;
    } else {
        return false;
    }
};

mongoose.model('User', userSchema);

User = mongoose.model('User', userSchema);

module.exports.User = User;