const express = require("express");
const router = express.Router();
const news_controller = require("../controllers/news.controller");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("Login");
};

const Routes = (passport) => {
  router.get("/", (req, res) => {
    res.render("welcome", {
      title: "Welcome",
      layout: "main",
      message: req.flash("message"),
    });
  });

  router.get("/login", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/home");
    res.render("login", {
      title: "Login",
      layout: "main",
      message: req.flash("message"),
    });
  });

  router.post(
    "/loginProcess",
    passport.authenticate("login", {
      successRedirect: "/home",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  router.get("/home", isAuthenticated, async (req, res) => {
    news_controller.news_getAll(req, res);
  });

  router.get("/register", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("home");
    res.render("register", {
      title: "register",
      layout: "main",
      message: req.flash("message"),
    });
  });

  router.post(
    "/registerHandle",
    passport.authenticate("register", {
      successRedirect: "/home",
      failureRedirect: "/register",
      failureFlash: true,
    })
  );

  router.get("/signOut", (req, res) => {
    req.logOut();
    res.redirect("/");
  });

  return router;
};

module.exports = Routes;
