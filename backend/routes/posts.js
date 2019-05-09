const express = require('express');
const multer = require('multer');

const Post = require('../models/post'); //Post Model from Mongoose
const checkAuth = require('../middleware/check-auth'); // custom middleware to validate Token

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
router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next)=>{
  const urlfile = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: urlfile + '/images/' + req.file.filename, //storing the image url in the DB
    creator: req.userData.userId
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

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {

  let imagePath = req.body.imagePath;

  if(req.file) {
    const urlfile = req.protocol + '://' + req.get('host');
    imagePath = urlfile + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  console.log(post);

  Post.updateOne( { _id: req.params.id, creator: req.userData.userId }, post )
    .then( result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Updated successfully", post: post });
      } else {
        res.status(401).json({ message: "Not authorized!" }); // 401 User not authorized
      }
    });
})

router.get('', (req, res, next) => {

  // getting pagination parameters
  const pageSize = +req.query.pagesize; // + is to convert to number
  const currentPage = +req.query.page; // + is to convert to number
  const postQuery = Post.find();
  let fetchedPosts;

  // creating pagination on the DB
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // To query data Mongoose provides us a static method
  // you can use the callback function or chain .then and .catch
  postQuery
    .then(documents => { //get the total number of posts and store the documents to be used in the next chain
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => { // chain another function with the result of the previous in the count variable
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
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

router.delete('/:id', checkAuth, (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId, creator: req.userData.userId  })
    .then( result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post deleted!' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    });
});

module.exports = router;
