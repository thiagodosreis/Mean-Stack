const mongoose = require('mongoose');

// The schema is just a blueprint / definition
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

// The model is the object based on the schema
// it also gives you a construct method (new Post();)
module.exports = mongoose.model('Post', postSchema);
