const { Blog_Model } = require("../models/Posts");

const blogPosts_getAll = async (req, res) => {
  try {
    const blogPosts = await Blog_Model.find();

    if (blogPosts.length === 0) {
      res.status(200).json({ message: "Nenhum post" });
    } else {
      res.status(200).json({
        status: "Blog Posts encontrados",
        numberOfPosts: blogPosts.length,
        listOfPosts: blogPosts,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Nenhum post");
  }
};

const blogPosts_editOne = async (req, res) => {
  const { title, videoUrl, text } = req.body;

  try {
    if (!title || !text) {
      res.status(400).json({ message: "Informações faltantes" });
    } else {
      const newBlogPost = await new Blog_Model({
        title,
        videoUrl,
        text,
      });

      await newBlogPost.save();
      res.status(201).json({
        status: "Post criado!",
        newBlogPost,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog post não criado");
  }
};

module.exports = {
  blogPosts_getAll,
  blogPosts_editOne,
};
