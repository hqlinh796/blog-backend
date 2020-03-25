const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    slug: String,
    posts: []
});

module.exports = mongoose.model('categories', categorySchema);