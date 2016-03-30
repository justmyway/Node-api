var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

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

/*userSchema.pre("save", function(next, done){
    var self = this;
     mongoose.models["User"].findOne({Email : self.Email},function(err, user) {
        if(err) {
            done(err);
        } else if(user) {
            self.invalidate("Email","Email moet unique zijn");
            done(new Error("Email must be unique"));
        } else {
            done();
        }
    });
    next();
});*/

userSchema.methods.hasAnyRole = function(roles) {
    return this.Roles.indexOf(roles) > -1;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} moet unique zijn.' });

mongoose.model('User', userSchema);

User = mongoose.model('User', userSchema);

module.exports.User = User;