const express = require('express');
const router = express.Router();
const naver = require('../config/naverSecret');
const axios = require("axios");
const auth = require("../middlewares/auth");
const { User } = require("../models");
const jwt = require('../module/jwt');

/**
 *  @route GET api/auth
 *  @desc Test Route
 *  @access Public
 */
router.get('/', auth, async function (req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Err');
  }
});


router.post('/token', async (req, res) => {

  const { id, isPremium } = req.body;
  console.log("req.body : ", req.body);
  try {
    const token = await jwt.sign({ id, isPremium });
    res.json(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 *  @route Post api/users
 *  @desc Register User
 *  @access Public
 */
router.get('/login', async (req, res) => {
  const api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + naver.client_id + '&redirect_uri=' + naver.redirectURI + '&state=' + naver.state;
  console.log(api_url);
  res.set({ 'access-control-allow-origin': '*' });
  res.redirect(api_url);
});


router.get('/test', async (req, res) => {
  res.json();
});

/**
 *  @route Post api/users
 *  @desc Register User
 *  @access Public
 */
router.get('/login/callback', async (req, res) => {
  const access_token = req.headers.authorization;
  const header = "Bearer " + access_token;
  const api_url = 'https://openapi.naver.com/v1/nid/me';
  const test = await axios({
    url: api_url,
    headers: { 'Authorization': header }
  });
  const user_info = test.data.response;
  const token = await jwt.sign(user_info);
  console.log(user_info);
  res.json(token);
});

module.exports = router;
