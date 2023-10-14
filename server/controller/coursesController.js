const { Course_Model } = require("../models/Course");

const courses_postOneCourse = async (req, res) => {
  const { courseTitle, img, courseImgLink, courseColor } = req.body;
  const course = await Course_Model.findOne({ courseTitle: courseTitle });
  try {
    if (!courseTitle) {
      return res.status(400).json({ message: "Título faltando" });
    } else if (course) {
      return res.status(400).json({ message: "Escolha um módulo" });
    } else {
      const newCourse = new Course_Model({
        courseTitle,
        img,
        courseImgLink,
        courseColor,
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

// const courses_editOneCourse = async (req, res) => {
//   const { courseTitle, description, courseImgLink } = req.body;

//   try {
//     const { id } = req.params;
//     const courseToEdit = await Course_Model.findById(id);
//     if (!courseToEdit) {
//       return res.status(404).json({ message: "Curso não encontrado" });
//     } else if (!courseTitle || !description) {
//       return res.status(404).json({ message: "Campos faltantes" });
//     } else if (
//       courseToEdit.courseTitle === courseTitle &&
//       courseToEdit.description === courseTitle &&
//       courseToEdit.courseImgLink === courseImgLink
//     ) {
//       res.json({
//         message: `Nenhuma edição feita no curso ${courseToEdit.courseTitle}`,
//       });
//     } else {
//       courseToEdit.courseTitle = courseTitle;
//       courseToEdit.description = description;
//       courseToEdit.courseImgLink = courseImgLink;

//       await courseToEdit.save();

//       res.status(200).json({
//         message: "Curso editado com sucesso",
//         updatedUser: courseToEdit,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: "Erro ao editar curso",
//     });
//   }
// };

// const courses_getAll = async (req, res) => {
//   try {
//     const courses = await Course_Model.find();
//     res.status(200).json({
//       courses,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "Erro ao encontrar cursos",
//     });
//   }
// };

// const courses_getOne = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course_Model.findById(id);

//     if (!course) {
//       res.status(400).json({
//         error: "Nenhum curso com este id",
//       });
//     } else {
//       res.status(200).json({
//         course,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: "Erro ao encontrar curso",
//     });
//   }
// };

// const courses_deleteOneCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const courseToDelete = await Course_Model.findById(id);
//     if (!courseToDelete) {
//       return res.status(404).json({ message: "Curso não encontrado" });
//     } else {
//       await courseToDelete.deleteOne();

//       res.status(200).json({
//         message: "Curso excluído com sucesso",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: "Erro ao excluir curso",
//     });
//   }
// };

// // classes inside
// const courses_postOneModule = async (req, res) => {
//   const { moduleTitle, description, moduleImgLink } = req.body;
//   try {
//     const { id } = req.params;
//     const courseToPostClassIn = await Course_Model.findById(id);
//     if (!courseToPostClassIn) {
//       return res.status(400).json({ message: "Curso não existe" });
//     } else if (!moduleTitle || !description) {
//       return res.status(400).json({ message: "Título ou descrição faltando" });
//     } else {
//       const newModule = {
//         moduleTitle: moduleTitle,
//         description: description,
//         moduleImgLink: moduleImgLink,
//       };

//       courseToPostClassIn.modules.push(newModule);
//       await courseToPostClassIn.save();
//       res.status(201).json({
//         newModule,
//         courseToPostClassIn,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: "Modulo não postado",
//     });
//   }
// };

// // classes inside
// const courses_editOneModule = async (req, res) => {
//   const { id, moduleTitle, description, moduleImgLink } = req.body;
//   try {
//     const { course } = req.params;
//     const courseWhoseModuleToEdit = await Course_Model.findById(course);

//     if (!courseWhoseModuleToEdit) {
//       return res.status(400).json({ message: "Curso não existe" });
//     }

//     const moduleToEdit = courseWhoseModuleToEdit.modules.find(
//       (moduleItem) => moduleItem._id == id
//     );

//     if (!moduleToEdit) {
//       return res.status(400).json({ message: "Módulo não existe" });
//     } else {
//       moduleToEdit.moduleTitle = moduleTitle;
//       moduleToEdit.description = description;
//       moduleToEdit.moduleImgLink = moduleImgLink;

//       await courseWhoseModuleToEdit.save();

//       res.status(201).json({
//         courseWhoseModuleToEdit,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: "Modulo não editado",
//     });
//   }
// };

module.exports = {
  courses_postOneCourse,
  // courses_editOneCourse,
  // courses_deleteOneCourse,
  // courses_getAll,
  // courses_getOne,
  // courses_postOneModule,
  // courses_editOneModule,
};
