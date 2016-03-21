var mongoose = require('mongoose');

var routesSchema = mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    Climber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    Outdoor: Boolean,
    Name: String,
    LeadClimbed: Boolean,
    Rope: String,
    Color: String,

    Location: {
        Longatude: String,
        Latetude: String,
        Area: String,
        City: String,
        Land: String
    },

    Grade: {
        France: String,
        German: String,
        Usa: String
    },

    Meta: {
        Created: {
            type: Date,
            default: Date.now
        },
        LastVisited: Date
    }
});

mongoose.model('Routes', routesSchema);

Route = mongoose.model('Routes', routesSchema);

module.exports.Route = Route;