const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    numPosts: Number
});

module.exports = mongoose.model('categories', categorySchema);