var mongoose = require('mongoose');

var routesSchema = mongoose.Schema({
    Id: String,
    //Climber: {type: Schema.Types.ObjectId},

    Outdoor: Boolean,
    Name: String,
    LeadClimbed: Boolean,
    Rope: String,
    Color: String,

    Location : {
    	Longatude: String,
    	Latetude: String,
    	City: String,
    	Land: String
    },

    Grade: {
    	France: String,
    	German: String
    },

    Meta: {
        Created: { type: Date, default: Date.now },
        LastVisited: Date
    }
});

mongoose.model('Routes', routesSchema);