const express = require('express');
const bodyParser = require('body-parser'); //middleware to parse the body of the incoming requests
const mongoose = require('mongoose');
const path = require('path'); //construct paths - from express

const postsRoutes = require('./routes/posts')

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

// Add middleware to Images folder Static Accessable
app.use('/images', express.static(path.join('backend/images'))); // also redirect the requests to /backend/images

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
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});


app.use("/api/posts", postsRoutes);

module.exports = app;
