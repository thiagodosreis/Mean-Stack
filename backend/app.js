const express = require('express');
const bodyParser = require('body-parser'); //middleware to parse the body of the incoming requests

const app = express(); //instantiating express

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
  const post = req.body;
  console.log(post);

  res.status(201).json({
    message: 'Post added sucessfully',
    post: post
  })
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: "fad127463l",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "ksajdjf132",
      title: "Second server-side post",
      content: "This is coming from the server"
    },
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
