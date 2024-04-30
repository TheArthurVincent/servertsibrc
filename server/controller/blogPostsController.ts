import { Request, Response } from "express";
import { Blog_ModelTS } from "../models/Posts";

const blogPosts_getAll_TS = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blogPosts = await Blog_ModelTS.find();

    if (blogPosts.length === 0) {
      res.status(200).json({
        message: "Nenhum post",
      });
    } else {
      const listReverse = blogPosts.reverse();
      const listOfPosts = [
        listReverse[0],
        listReverse[1],
        listReverse[2],
        listReverse[3],
      ];

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

export const blogPosts_getOne = async (req: Request, res: Response) => {
  try {
    const blogPost = await Blog_ModelTS.findById(req.params.id);
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

export const blogPosts_postOne = async (req: Request, res: Response) => {
  const { title, videoUrl, text, img } = req.body;

  try {
    const existingTitle = await Blog_ModelTS.findOne({ title: title });
    if (!title || !text) {
      res.status(400).json({ message: "Informações faltantes" });
    } else if (existingTitle) {
      return res
        .status(400)
        .json({ message: "Escolha outro título, este já existe." });
    } else {
      const newBlogPost = await Blog_ModelTS.create({
        title,
        videoUrl,
        text,
        img,
      });

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

export const blogPosts_editOne = async (req: Request, res: Response) => {
  const { title, videoUrl, text, img } = req.body;

  try {
    const { id } = req.params;
    const postToEdit = await Blog_ModelTS.findById(id);
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
      await postToEdit.updateOne({
        title,
        videoUrl,
        text,
        img,
      });

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

export const blogPosts_deleteOne = async (req: Request, res: Response) => {
  try {
    const blogPost = await Blog_ModelTS.findById(req.params.id);
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

export { blogPosts_getAll_TS };
