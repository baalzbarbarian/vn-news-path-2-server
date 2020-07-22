const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let NewsSchema = new Schema({
    NewsCat: {type: String, required: true},
    Matter: {type: String, required: true},
    Content: {type: String, required: true},
    Author: {type: String, required: true},
    Image: {type: String, contentType: String},
    Date: {type: String, required: true},
});

module.exports = mongoose.model('news', NewsSchema);