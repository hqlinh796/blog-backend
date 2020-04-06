const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    slug: String,
    posts: [],
    cover: String
});

module.exports = mongoose.model('categories', categorySchema);