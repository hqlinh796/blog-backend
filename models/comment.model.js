const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    name: String,
    email: String,
    content: String,
    rate: Number,
    date: Date
});

module.exports = mongoose.model('comments', commentSchema);