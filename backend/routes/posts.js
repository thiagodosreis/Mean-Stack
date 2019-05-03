const express = require('express');
const multer = require('multer');

const Post = require('../models/post'); //Post Model from Mongoose

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// updload images
const storage = multer.diskStorage({
  //function executed whenever multer try to save a file
  destination: (req, file, cb) => {
    // error if ext is wrong
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


// added a middleware before the callback function to treat the image property posted to upload.
router.post('', multer({storage: storage}).single('image'), (req, res, next)=>{
  const urlfile = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: urlfile + '/images/' + req.file.filename //storing the image url in the DB
  });

  console.log("post:"+JSON.stringify(post));

  // Mongoose Save command will automatically write the data to the DB.
  // Collection name will always be the plural form of your Model
  post.save().then( result => {
    res.status(201).json({
      message: 'Post added sucessfully',
      post: {
        id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath
      }
    });
  });

});

router.put('/:id', multer({ storage: storage }).single('image'), (req, res, next) => {

  let imagePath = req.body.imagePath;

  if(req.file) {
    const urlfile = req.protocol + '://' + req.get('host');
    imagePath = urlfile + '/images/' + req.file.filename;
  }


  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  console.log(post);

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
