const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();

// Router has only the accessable endpoints and call the controller function / middleware
// from the controler folders. It could have the functions here, but having the controller
// folder makes the app cleaner and the router files easier to read.

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;
