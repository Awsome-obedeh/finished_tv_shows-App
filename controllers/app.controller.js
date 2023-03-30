const axios = require('axios');
const personModel = require('./../models/people.model');
const bcrypt = require('bcrypt');
const { request, response } = require('express');

// define the APIs endpoints for the episodate API
const tvShowsAPI = 'https://www.episodate.com/api/most-popular';
const detailsAPI = 'https://www.episodate.com/api/show-details?q=';
const searchAPI = 'https://www.episodate.com/api/search?q=';

const homePage = async function (req, res) {
  let { page } = req.query;

  try {
      if (typeof page === 'undefined' || page < 1) {
          page = 1;
      }

      const resp = await axios.get(tvShowsAPI + `?page=${page}`);
      
      res.render('movies', { movies: resp.data });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occured" });
  }
}

const getRegister = async function (req, res) {
  res.render('register', { errors: null });
}

const getMovie = async function (req, res) {
  const { id } = req.query;
  const url = detailsAPI + id;

  try {
      const resp = await axios.get(url);
      const data = resp.data;

      if (data.tvShow.length == 0) {
          res.redirect('/');
          return;
      }

      res.render('movie', { movie: data.tvShow });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occured" });
  }
}

const search = async function (req, res) {
  const { q } = req.query;

  try {
      const url = searchAPI + q;

      const resp = await axios.get(url);
      const data = resp.data;

      res.status(200).json({ movies: data.tv_shows });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occured" });
  }
}

const registerUser = async function (req, res) {
  try {
    const userInfo = req.body;

    await personModel.create(userInfo);

    res.redirect('/login');
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach(field => { 
          errors[field] = error.errors[field].message
      });

      res.render('register', { errors: errors })
      return;
    }

    console.log(error);

    res.status(500).json({ message: "Internal server error" })
  }
}

const getLogin = async function (req, res) {
  res.render('login', { error: null });
}

/**
 * Logs users in
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
const login = async function (req, res) {
  const { email, password } = req.body;

  try {
    if (typeof email == "undefined") {
      res.render('login', { error: "Please insert an email" })
      return;
    }
    
    if (typeof password == "undefined") {
      res.render('login', { error: "Please insert a password" })
      return;
    }

    // search for any user with that email
    const user = await personModel.findOne({ email: email });

    if (user == null) {
      res.render('login', { error: "Invalid credentials" });
      return;
    }

    // compare password
    const hasValidPass = bcrypt.compareSync(password, user.password);

    if (hasValidPass === false) {
      res.render('login', { error: "Invalid credentials" });
      return;
    }

    // assign the token
    res.cookie('status', "loggedIn");

    res.redirect("/home");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const isLoggedIn = async function (req, res, next) {
  if (typeof req.cookies.status == "undefined") {
    res.redirect('/login');
  }

  next();
}

module.exports = {
  homePage,
  getMovie,
  getRegister,
  login,
  getLogin,
  registerUser,
  search,
  isLoggedIn
}