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

const blogPosts_getSpecific = async (req, res) => {
  const { title } = req.body;
  const blogPosts = await Blog_Model.find({
    title: { $regex: title, $options: "i" },
  });

  if (!blogPosts) {
    res.status(500).send("Nenhum post com este nome");
    return;
  }
  try {
    const formattedBlogPosts = blogPosts.map((blogPost, index) => {
      return {
        position: index,
        title: blogPost.title,
        videoUrl: blogPost.videoUrl,
        text: blogPost.text,
        createdAt: blogPost.createdAt,
      };
    });
    res.status(200).json({
      status: "Posts encontrados",
      posts: blogPosts,
      numberOfPosts: formattedBlogPosts.length,
      listOfPosts: formattedBlogPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Nenhum aluno");
  }
};

const blogPosts_postOne = async (req, res) => {
  const { title, videoUrl, text } = req.body;

  try {
    const existingTitle = await Blog_Model.findOne({
      title: title,
    });
    if (!title || !text) {
      res.status(400).json({ message: "Informações faltantes" });
    } else if (existingTitle) {
      return res
        .status(400)
        .json({ message: "Escolha outro título, este já existe." });
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

const blogPosts_editOne = async (req, res) => {
  const { title, videoUrl, text } = req.body;

  try {
    if (!title || !text) {
      return res.status(400).json({ message: "Informações faltantes" });
    } else {
      const existingBlogPost = await Blog_Model.findOne({ title: title });

      if (!existingBlogPost) {
        return res.status(400).json({ message: "Post não existe" });
      }

      if (
        existingBlogPost.title === title &&
        existingBlogPost.videoUrl === videoUrl &&
        existingBlogPost.text === text
      ) {
        res.json({
          message: `Nenhuma edição feita no post ${existingBlogPost.title}`,
        });
      } else {
        existingBlogPost.title = title;
        existingBlogPost.videoUrl = videoUrl;
        existingBlogPost.text = text;
        await existingBlogPost.save();
        res.status(201).json({
          message: "Post editado com sucesso!",
          updatedBlogPost: existingBlogPost,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog post não editado");
  }
};

const blogPosts_deleteOne = async (req, res) => {
  try {
    const { title } = req.body;
    const blogPost = await Blog_Model.findOne({ title: title });
    if (!blogPost) {
      return res.status(404).json({ message: "Post não existe" });
    } else {
      await blogPost.deleteOne();
      res.status(200).json({
        status: "Post excluído",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Falha ao excluir post!", status: error });
  }
};

module.exports = {
  blogPosts_getAll,
  blogPosts_editOne,
  blogPosts_getSpecific,
  blogPosts_postOne,
  blogPosts_deleteOne,
};
