const category = require("../models/category.model");
const news = require("../controllers/news.controller");

exports.getAll = async (req, res) => {
  try {
    let cat = await category.find({});
    console.log("Cat: " + cat);
    res.send(cat);
  } catch (error) {
    console.log(error);
  }
}

exports.cat_getCatToCreateNews = async (req, res) => {
  category
    .find({})
    .lean()
    .exec((err, data) => {
      if (err) {
        console.log("Error at cat_getCat: " + err);
      }
      res.render("newsCreate", {
        user: req.user.name,
        catList: data.reverse(),
      });
    });
};

exports.cat_getAll = async (req, res) => {
  category
    .find({})
    .lean()
    .exec((err, data) => {
      if (err) {
        console.log("Error at cat_getAll: " + err);
      }
      res.render("category", {
        title: "Admin Dashboard",
        layout: "main",
        catData: data.reverse(),
        user: req.user.name,
      });
    });
};

exports.cat_create = function (req, res) {
  let catNameFromForm = req.body.catName;

  category
    .findOne({ catName: catNameFromForm })
    .lean()
    .exec((err, data) => {
      if (data == null) {
        let cat = new category({
          catName: catNameFromForm,
          Description: req.body.catDes,
        });

        cat.save((err) => {
          if (err) {
            res.render("category", { message: "Create News Category Failed!" });
            console.log("Error at cat_create method in category controller");
          }
          category
            .find({})
            .lean()
            .exec((err, data) => {
              if (err) {
                console.log("Error at cat_getAll: " + err);
              }
              res.render("category", {
                title: "Admin Dashboard",
                layout: "main",
                catData: data.reverse(),
                message: "Create News Category Successfully!",
              });
            });
        });
      } else {
        res.redirect('/category');
        // category
        //   .find({})
        //   .lean()
        //   .exec((err, data) => {
        //     if (err) {
        //       console.log("Error at cat_getAll: " + err);
        //     }
        //     res.render("category", {
        //       title: "Admin Dashboard",
        //       layout: "main",
        //       catData: data.reverse(),
        //       user: req.user.name,
        //       message: "Loại tin này đã tồn tại. Vui lòng kiểm tra lại!"
        //     });
        //   });
      }
    });
};

exports.cat_getCat = (req, res) => {
  category
    .findById(req.params.id)
    .lean()
    .exec((err, doc) => {
      if (!err) {
        res.render("catEdit", {
          Cat: doc,
          user: req.user.name,
        });
      }
    });
};

exports.cat_update = function (req, res) {
  category.updateOne(
    { _id: req.body._id },
    { $set: { catName: req.body.catName, Description: req.body.catDes } },
    (err, data) => {
      if (!err) {
        news.updateManyNewsByCatName(req, res);

        category
          .find({})
          .lean()
          .exec((err, data) => {
            if (err) {
              console.log("Error at cat_getAll: " + err);
            }
            res.render("category", {
              catData: data.reverse(),
              // user: req.user.name,
              updateMessage: "Category has been updated!",
            });
          });
      } else {
        console.log("Edit Failed");
      }
    }
  );
};

exports.cat_delete = (req, res) => {
  news.news_deleteAllByCatName(req, res);

  category.deleteOne({ catName: req.params.oldCat }, (err, doc) => {
    if (!err) {
      category
        .find({})
        .lean()
        .exec((err, data) => {
          if (err) {
            console.log("Error at cat_delete: " + err);
          }
          res.render("category", {
            catData: data.reverse(),
            user: req.user.name,
            updateMessage: "Category has been deleted!",
          });
        });
    } else {
      console.log(err);
    }
  });
};
