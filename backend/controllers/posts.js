const Post = require('../models/post'); //Post Model from Mongoose

exports.createPost = (req, res, next)=>{
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
  })
  .catch(error => {
    res.status(500).json({ //internal server error
      message: 'Creating a post failed!'
    });
  });
};

exports.updatePost = (req, res, next) => {

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
    })
    .catch(error => {
      res.status(500).json({ //internal server error
        message: 'Couldn\'t update post!'
      });
    });
};

exports.getPosts = (req, res, next) => {

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
    })
    .catch(error => { //internal server error
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });

};

exports.getPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then( document => {
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json( { message: "Post not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({ //internal server error
      message: 'Fetching post failed!'
    });
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId, creator: req.userData.userId  })
    .then( result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post deleted!' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({ //internal server error
        message: 'Fetching post failed!'
      });
    });;
};
