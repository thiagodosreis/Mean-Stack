const express = require('express');

const Post = require('../models/post'); //Post Model from Mongoose

const router = express.Router();


router.post('', (req, res, next)=>{
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne( { _id: req.params.id }, post )
    .then( result => {
      res.status(200).json({ message: "Updated successfully", post: post });
    });

})

router.get('', (req, res, next) => {

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

router.get('/:id', (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then( document => {
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json( { message: "Post not found!" });
    }
  })
});

router.delete('/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId })
    .then( result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    });


});

module.exports = router;
