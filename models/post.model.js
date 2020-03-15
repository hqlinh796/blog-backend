const mongoose = require('mongoose');
const commentModel = require('./comment.model');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    author: {type: String, default: 'Linh Hà'},
    category: {type: String, required: true},
    date: {type: Date, default: Date.now},
    content: {type: String, required: true},
    cover: {type: String, required: true},
    rate: {type: Number, default: 0},
    tags: {type: Array, default: []},
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'comments' } ]
})

module.exports = mongoose.model('posts', postSchema);