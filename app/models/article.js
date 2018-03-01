var mongoose = require('mongoose'); // Import Mongoose Package

// User Mongoose Schema
var SlideSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true},
    text: { type: String, required: true},
    imagekey: { type: String, required: true}
}, {usePushEach: true });

var ArticleSchema = new mongoose.Schema({
    keywords: { type: String},
    title: { type: String, required: true},
    description: { type: String},
    tags: { type: String},
    keywords: { type:String},
    url: {type: String},
    draft: {type: Boolean, default: true}, 
    createdOn: { type:Date, "default": Date.now() },
    slides:[SlideSchema]
}, {usePushEach: true });

module.exports = mongoose.model('Article', ArticleSchema, 'article'); // Export User Model for us in API