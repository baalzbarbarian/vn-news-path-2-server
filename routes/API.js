const express = require("express");
const router = express.Router();

const API = require('../controllers/news.controller');
const APICat = require('../controllers/category.controller');

//get all news
router.get('/api/news', API.getAll);

//get all category to create tabs news
router.get('/api/category', APICat.getAll);

//Get news by cat
router.get('/api/newsByCat/:catName', API.getNewsByCat);

router.get('/api/getNewsById/:id', API.getNewsById);

module.exports = router;