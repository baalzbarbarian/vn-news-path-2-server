const express = require("express");
const router = express.Router();
const uploadImage = require("../config/multer");
const category = require("../controllers/category.controller");
const news_controller = require("../controllers/news.controller");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.render("welcome");
};

const newsRoutes = (passport) => {

  router.get("/home", isAuthenticated, async (req, res) => {
    news_controller.news_getAll(req, res);
  });


  //To create a select Category to choose when create a new news.
  router.get("/newsCreate", isAuthenticated, async (req, res) => {
    category.cat_getCatToCreateNews(req, res);
  });
  
  router.post("/createNews", uploadImage.single('image'), (req, res) => {
    news_controller.news_create(req, res);
  });

  //Get id to edit news
  router.get("/updateNews/:id", isAuthenticated, async (req, res) => {
    news_controller.news_getNews(req, res);
  });

  //update news by id
  router.post("/newsUpdate", uploadImage.single('image'), (req, res) => {
    news_controller.news_update(req, res);
  });

  router.get('/deleteNews/:id', isAuthenticated, async (req, res) => {
    news_controller.news_delete(req, res);
  })

  return router;
};

module.exports = newsRoutes;
