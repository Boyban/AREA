const mongoose = require('mongoose');

var WidgetSchema = new mongoose.Schema({
    id : Number,
    cl : Number,
    text : String,
    icon : String,
    parameters : Object,
    treated: Date
});

module.exports = mongoose.model('Widget', WidgetSchema);
