const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //plugin

// The schema is just a blueprint / definition
const userSchema = mongoose.Schema({
  email: { type: String, required: true , unique: true }, // unique: true is not for validation, only for index
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // now unique is being validated as an identity by the plugin

// The model is the object based on the schema
// it also gives you a construct method (new User();)
module.exports = mongoose.model('User', userSchema);
