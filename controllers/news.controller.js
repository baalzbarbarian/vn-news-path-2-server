const newsModel = require("../models/news.model");
const catModel = require("../models/category.model");

//get all news to show on smartphone
exports.getAll = async (req, res) => {
  try {
    let news = await newsModel.find({});
    res.send(news);
  } catch (error) {
    console.log(error);
  }
}

//get news by category to show on smartphone
exports.getNewsByCat = async (req, res) => {
  try {
    let newsByCat = await newsModel.find({NewsCat : req.params.catName });
    res.send(newsByCat);
  } catch (error) {
    console.log(error);
    res.send("[]");
  }
}

//get news by id to show on smartphone
exports.getNewsById = async (req, res) => {
  try {
    let news = await newsModel.find({_id : req.params.id });
    res.send(news);
  } catch (error) {
    console.log(error);
    res.send("[]");
  }
}

exports.news_getAll = (req, res) => {
  newsModel
    .find({})
    .lean()
    .exec((err, data) => {
      if (err) {
        console.log("Error at cat_getAll: " + err);
      }
      res.render("home", {
        newsData: data.reverse(),
        user: req.user.name,
      });
    });
};

//get news to edit news
exports.news_getNews = (req, res) => {
  let catList;

  catModel.find({}).lean().exec((err, catData) => {
    if(!err) {
      catList = catData;
    }
  })

  newsModel
    .findById(req.params.id)
    .lean()
    .exec((err, doc) => {
      if (!err) {
        res.render("newsEdit", {
          News: doc,
          catList: catList,
          user: req.user.name,
        });
      }
    });
};

exports.news_create = (req, res) => {
  let news = new newsModel({
    NewsCat: req.body.newsCat,
    Matter: req.body.matter,
    Author: req.body.author,
    Content: req.body.content,
    Image: req.file.originalname,
    Date: req.body.date,
  });

  news.save((err) => {
    if (err) {
      res.render("home", { message: "Create New News Failed!" });
      console.log("Error at news_create method in news controller");
    }

    newsModel
      .find({})
      .lean()
      .exec((err, data) => {
        if (err) {
          console.log("Error at cat_getAll: " + err);
        }
        res.redirect("/home");
      });
  });
};

exports.news_update = function (req, res) {

  try {
    newsModel.updateOne(
      { _id: req.body._id },
      {
        $set: {
          NewsCat: req.body.newsCat,
          Matter: req.body.matter,
          Content: req.body.content,
          Author: req.body.author,
          Date: req.body.date,
          Image: req.file.originalname,
        },
      },
      (err, data) => {
        if (!err) {
          res.redirect("/home");
        } else {
          console.log("Update Failed");
        }
      }
    );
  } catch (error) {
    newsModel.updateOne(
      { _id: req.body._id },
      {
        $set: {
          NewsCat: req.body.newsCat,
          Matter: req.body.matter,
          Content: req.body.content,
          Author: req.body.author,
          Date: req.body.date,
        },
      },
      (err, data) => {
        if (!err) {
          res.redirect("/home");
        } else {
          console.log("Update Failed");
        }
      }
    );
  }
  
};

exports.updateManyNewsByCatName = (req, res) => {
  newsModel.updateMany(
    {NewsCat: req.body.oldCat},
    { $set: {NewsCat: req.body.catName}},
    (err2, data2) => {
      if(err2){
        console.log("Error at cat_getAll: " + err2);
      }
    }
  )
}

exports.news_delete = (req, res) => {
  newsModel.deleteOne({ _id: req.params.id }, (err, doc) => {
      if (!err) {
        newsModel
          .find({})
          .lean()
          .exec((err, data) => {
            if (err) {
              console.log("Error at news_Delete: " + err);
            }
            res.redirect("/home");
          });
      } else {
          console.log(err);
      }
  });
};

exports.news_deleteAllByCatName = (req, res) => {
  newsModel.deleteMany({NewsCat: req.params.oldCat}, (err) => {
    if(err){
      console.log("Error at news_deleteAllByCatName: " + err);
    }
  })
}