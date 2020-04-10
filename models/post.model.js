const mongoose = require('mongoose');
const commentModel = require('./comment.model');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    author: {type: String, default: 'Linh Hà'},
    category: {type: Object, required: true},
    date: {type: Number, required: true},
    content: {type: String, required: true},
    cover: {type: String, required: true},
    rating: [],
    views: {type: Number, default: 0},
    tags: {type: Array, default: []}
})

module.exports = mongoose.model('posts', postSchema);