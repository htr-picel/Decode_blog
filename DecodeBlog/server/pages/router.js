const express = require("express");
const router = express.Router();
const Genres = require("../Genres/Genres");
const User = require("../auth/User");
const Blog = require("../Blogs/blog");

router.get("/", async (req, res) => {
  const options = {};
  const genres = await Genres.findOne({ key: req.query.genre });
  if (genres) {
    options.genre = genres._id;
    res.locals.genre = req.query.genre;
  }
  let page = 0;
  const limit = 2;
  if (req.query.page && req.query.page > 0) {
    page = req.query.page;
  }
  if (req.query.search && req.query.search.length > 0) {
    options.$or = [
      {
        name: new RegExp(req.query.search, "i"),
      },
    ];
  }
  res.locals.search = req.query.search;
  const totalBlog = await Blog.countDocuments(options);
  const allGenres = await Genres.find();
  const blog = await Blog.find(options)
    .limit(limit)
    .skip(page * limit)
    .populate("genre")
    .populate("author");
  res.render("index", {
    genres: allGenres,
    user: req.user ? req.user : {},
    blog: blog,
    pages: Math.ceil(totalBlog / limit),
  });
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/profile', async (req, res) => {
  const blogs = await Blog.find({});
  res.render('profile', { blogs });
});

router.post('/newBlog', async (req, res) => {
  const { title, content, genre } = req.body;
  const newBlog = new Blog({ title, content, genre });
  await newBlog.save();
  res.redirect('/my-blogs');
});


router.get("/login", (req, res) => {
  res.render("login", { user: req.user ? req.user : {} });
});

router.get("/register", (req, res) => {
  res.render("register", { user: req.user ? req.user : {} });
});

router.get("/new", async (req, res) => {
  const allGenres = await Genres.find();
  res.render("newBlog", { genres: allGenres, user: req.user ? req.user : {} });
});

router.get("/edit/:id", async (req, res) => {
  const allGenres = await Genres.find();
  const blog = await Blog.findById(req.params.id);
  res.render("editBlog", {
    genres: allGenres,
    user: req.user ? req.user : {},
    blog,
  });
});

router.get("/profile/:id", async (req, res) => {
  const allGenres = await Genres.find();
  const blog = await Blog.find().populate("genre").populate("author");
  const user = await User.findById(req.params.id);
  if (user) {
    res.render("profile", {
      user: user,
      genres: allGenres,
      loginUser: req.user,
      blog: blog,
    });
  } else {
    res.redirect("/not-found");
  }
});
router.get("/not-found", (req, res) => {
  res.render("notFound");
});

router.get("/details/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate("genre")
    .populate("author");
  const allGenres = await Genres.find();
  res.render("details", {
    user: req.user ? req.user : {},
    blog: blog,
    genres: allGenres,
  });
});

module.exports = router;
