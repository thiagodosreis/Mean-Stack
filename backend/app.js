const express = require('express');
const bodyParser = require('body-parser'); //middleware to parse the body of the incoming requests
const mongoose = require('mongoose');

const Post = require('./models/post'); //Post Model from Mongoose

const app = express(); //instantiating express

// connecting to Mongodb Atlas through Mongoose.
mongoose.connect("mongodb+srv://mean_db:1KX6ElufqHLroKFc@meanstackcourse-icttz.mongodb.net/meandb?retryWrites=true")
  .then(() => {
    console.log('Connected to the DB!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json()); //parsing JSON incoming data
app.use(bodyParser.urlencoded({ extended: false })); //parsing URL encoded data


//CORS
app.use((req, res, next)=>{
  //allows requests from any domain
  res.setHeader('Access-Control-Allow-Origin', '*'); //key: value
  //domains using this headers can access. Block if there any other not listed
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
    );
  //Which http verbs are allowed. OPTIONS is sent by default by the browser
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});



app.post('/api/posts', (req, res, next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  // Mongoose Save command will automatically write the data to the DB.
  // Collection name will always be the plural form of your Model
  post.save().then( result => {
    res.status(201).json({
      message: 'Post added sucessfully',
      postId: result._id
    });
  });

});

app.get('/api/posts', (req, res, next) => {

  // To query data Mongoose provides us a static method
  // you can use the callback function or chain .then and .catch
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    });

});

app.delete('/api/posts/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId })
    .then( result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    });


});

module.exports = app;
