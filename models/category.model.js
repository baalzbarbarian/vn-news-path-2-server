const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let CategorySchema = new Schema({
    catName: {type: String, required: true,},
    Description: {type: String, required: false},
});

module.exports = mongoose.model('category', CategorySchema);