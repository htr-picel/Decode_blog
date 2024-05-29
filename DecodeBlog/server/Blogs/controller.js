const Blog = require("./blog");
const fs = require("fs");
const path = require("path");

const createBlog = async (req, res) => {
  console.log('Received blog creation request');
  console.log('req.file:', req.file);
  console.log('req.body.name:', req.body.name);
  console.log('req.body.description:', req.body.description);
  console.log('req.body.genre:', req.body.genre);

  if (
    req.file &&
    req.body.name.length > 2 &&
    req.body.description.length > 2 &&
    req.body.genre.length > 2
  ) {
    try {
      await new Blog({
        name: req.body.name,
        genre: req.body.genre,
        description: req.body.description,
        image: `/img/blogs/${req.file.filename}`,
        author: req.user._id,
      }).save();
      console.log('Blog post created successfully');
      res.redirect(`/profile/${req.user._id}`);
    } catch (error) {
      console.error('Error saving blog post:', error);
      res.redirect("/new?error=1");
    }
  } else {
    console.log('Validation failed');
    res.redirect("/new?error=1");
  }
};

const editBlog = async (req, res) => {
  try {
    if (
      req.body.name.length > 2 &&
      req.body.description.length > 2 &&
      req.body.genre.length > 2
    ) {
      const blog = await Blog.findById(req.body.id);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }

      const imagePath = path.join(__dirname, "../../../public", blog.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }

      const updatedBlog = await Blog.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        genre: req.body.genre,
        description: req.body.description,
        image: `/img/blogs/${req.file.filename}`, 
        author: req.user._id,
      }, { new: true });

      if (!updatedBlog) {
        return res.status(404).send("Blog not found after update");
      }

      
      return res.redirect("/profile/" + req.user._id);
    } else {
      return res.redirect(`/edit/${req.body.id}?error=1`);
    }
  } catch (error) {
    console.error("Error editing blog:", error);
    return res.status(500).send("An error occurred while editing the blog");
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    fs.unlinkSync(path.join(__dirname + "../../../public" + blog.image));
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).send("ok");
  } else {
    res.status(404).send("Not Found");
  }
};
module.exports = {
  createBlog,
  editBlog,
  deleteBlog,
};
