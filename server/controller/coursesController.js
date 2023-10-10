const { Course_Model } = require("../models/Course");

const courses_postOneCourse = async (req, res) => {
  const { courseTitle, description, courseImgLink } = req.body;
  const course = await Course_Model.findOne({ courseTitle: courseTitle });
  try {
    if (!courseTitle) {
      return res.status(400).json({ message: "Título faltando" });
    } else if (!description) {
      return res.status(400).json({ message: "Descrição faltando" });
    } else if (course) {
      return res.status(400).json({ message: "Título já estão em uso" });
    } else {
      const newCourse = new Course_Model({
        courseTitle,
        description,
        courseImgLink,
      });

      await newCourse.save();

      res.status(201).json({
        status: "Curso criado",
        newCourse,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Curso não postado",
    });
  }
};

const courses_editOneCourse = async (req, res) => {
  const { courseTitle, description, courseImgLink } = req.body;

  try {
    const { id } = req.params;
    const courseToEdit = await Course_Model.findById(id);
    if (!courseToEdit) {
      return res.status(404).json({ message: "Curso não encontrado" });
    } else if (!courseTitle || !description) {
      return res.status(404).json({ message: "Campos faltantes" });
    } else if (
      courseToEdit.courseTitle === courseTitle &&
      courseToEdit.description === courseTitle &&
      courseToEdit.courseImgLink === courseImgLink
    ) {
      res.json({
        message: `Nenhuma edição feita no curso ${courseToEdit.courseTitle}`,
      });
    } else {
      courseToEdit.courseTitle = courseTitle;
      courseToEdit.description = description;
      courseToEdit.courseImgLink = courseImgLink;

      await courseToEdit.save();

      res.status(200).json({
        message: "Curso editado com sucesso",
        updatedUser: courseToEdit,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao editar curso",
    });
  }
};

const courses_getAll = async (req, res) => {
  try {
    const courses = await Course_Model.find();
    res.status(200).json({
      courses,
    });
  } catch (error) {
    res.status(400).json({
      status: "Erro ao encontrar cursos",
    });
  }
};

const courses_getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course_Model.findById(id);

    if (!course) {
      res.status(400).json({
        error: "Nenhum curso com este id",
      });
    } else {
      res.status(200).json({
        course,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao encontrar curso",
    });
  }
};

const courses_deleteOneCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseToDelete = await Course_Model.findById(id);
    if (!courseToDelete) {
      return res.status(404).json({ message: "Curso não encontrado" });
    } else {
      await courseToDelete.deleteOne();

      res.status(200).json({
        message: "Curso excluído com sucesso",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao excluir curso",
    });
  }
};

module.exports = {
  courses_postOneCourse,
  courses_editOneCourse,
  courses_deleteOneCourse,
  courses_getAll,
  courses_getOne,
};
