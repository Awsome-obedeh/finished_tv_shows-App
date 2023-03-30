// create a new express router similar to our app
const router = require('express').Router();

// import the functions to be performed on each route
const { isLoggedIn, search, getMovie, getRegister, getLogin, login, homePage, registerUser } = require('./../controllers/app.controller');

// localhost:3000/home will use the homePage function
router.get('/home', isLoggedIn, homePage);

// a get request to localhost:3000/register will use the getRegister function
router.get('/register', getRegister);

// a post request to localhost:3000/register will use the registerUser function
router.post('/register', registerUser)

// localhost:3000/login will use the login function
router.get('/login', getLogin);

// a post request to localhost:3000/login will use the login function
router.post('/login', login);

// localhost:3000/movie will use the getMovie function
router.get('/movie', getMovie)

// localhost:3000/search will use the search function
router.get('/search', search)

// export the router so the app.js can use it
module.exports = router;