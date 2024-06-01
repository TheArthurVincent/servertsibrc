const { Blog_Model } = require("../models/Posts");
const { sendEmail } = require("../useful/sendpulse");

const blogPosts_getAll = async (req, res) => {
  try {
    const blogPosts = await Blog_Model.find();

    if (blogPosts.length === 0) {
      res.status(200).json({
        message: "Nenhum post",
      });
    } else {
      const listReverse = blogPosts.reverse();
      const listOfPosts = [listReverse[0], listReverse[1], listReverse[2]];

      res.status(200).json({
        status: "Blog Posts encontrados",
        numberOfPosts: blogPosts.length,
        listOfPosts,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, listOfPosts: "Nenhum post encontrado" });
  }
};

const blogPosts_getOne = async (req, res) => {
  const blogPost = await Blog_Model.findById(req.params.id);
  try {
    if (!blogPost) {
      return res.status(404).json({ message: "Post não encontrado" });
    }
    const formattedBlogPost = {
      id: blogPost._id,
      title: blogPost.title,
      videoUrl: blogPost.videoUrl,
      text: blogPost.text,
    };
    res.status(200).json({
      status: "Post encontrado",
      formattedBlogPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog post não encontrado");
  }
};

const blogPosts_postOne = async (req, res) => {
  
  const { title, videoUrl, text, img } = req.body;

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
      const newBlogPost = new Blog_Model({
        title,
        videoUrl,
        text,
        img,
      });

      try {
        sendEmail(text, title, title, "Arthur", "arthurcardosocorp@gmail.com");
        console.log("Email enviado com sucesso");
      } catch (emailError) {
        console.error("Erro ao enviar o email:", emailError);
      }

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
  const { title, videoUrl, text, img } = req.body;

  try {
    const { id } = req.params;
    const postToEdit = await Blog_Model.findById(id);
    if (!postToEdit) {
      return res.status(404).json({ message: "Post não encontrado" });
    } else if (!title || !text) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (
      postToEdit.title === title &&
      postToEdit.videoUrl === videoUrl &&
      postToEdit.text === text &&
      postToEdit.img === img
    ) {
      res.json({
        message: `Nenhuma edição feita no post ${postToEdit.title}`,
      });
    } else {
      postToEdit.title = title;
      postToEdit.videoUrl = videoUrl;
      postToEdit.text = text;
      postToEdit.img = img;

      await postToEdit.save();

      res.status(200).json({
        message: "Post editado com sucesso",
        updatedUser: postToEdit,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blog post não editado" });
  }
};

const blogPosts_deleteOne = async (req, res) => {
  const blogPost = await Blog_Model.findById(req.params.id);

  try {
    if (!blogPost) {
      return res.status(404).json({ message: "Post não existe" });
    } else {
      await blogPost.deleteOne();
      res.status(200).json({
        status: "Post excluído",
      });
    }
  } catch (error) {
    res.status(500).json({ erro: "Falha ao excluir post!", status: error });
  }
};

module.exports = {
  blogPosts_getAll,
  blogPosts_editOne,
  blogPosts_getOne,
  blogPosts_postOne,
  blogPosts_deleteOne,
};
