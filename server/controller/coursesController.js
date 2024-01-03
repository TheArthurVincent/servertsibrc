const { Course_Model, Module_Model, Class_Model } = require("../models/Course");

const courses_postOneCourse = async (req, res) => {
  const { courseTitle, img, link, courseColor, description } = req.body;
  const course = await Course_Model.findOne({ courseTitle: courseTitle });
  try {
    if (!courseTitle || !link) {
      return res.status(400).json({ message: "Título faltando" });
    } else if (course) {
      return res.status(400).json({ message: "Escolha outro título" });
    } else {
      const newCourse = new Course_Model({
        courseTitle,
        img,
        link,
        courseColor,
        description,
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
  const { id } = req.params;

  try {
    const classDetails = await Class_Model.findById(id);

    if (!classDetails) {
      return res.status(404).json({ error: "Aula não encontrada" });
    }

    res.json(classDetails);
  } catch (error) {
    console.error("Erro ao obter os detalhes da aula:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const courses_editOneCourse = async (req, res) => {
  const { courseTitle, img, courseColor, description } = req.body;
  const { id } = req.params;

  try {
    const courseToEdit = await Course_Model.findById(id);
    if (!courseToEdit) {
      return res.status(404).json({ message: "Curso não encontrado" });
    } else if (!courseTitle || !img || !courseColor) {
      return res.status(404).json({ message: "Campos faltantes" });
    } else if (
      courseToEdit.courseColor === courseColor &&
      courseToEdit.description === description &&
      courseToEdit.courseTitle === courseTitle &&
      courseToEdit.img === img
    ) {
      res.json({
        message: `Nenhuma edição feita no curso ${courseToEdit.courseTitle}`,
      });
    } else {
      courseToEdit.courseTitle = courseTitle;
      courseToEdit.description = description;
      courseToEdit.img = img;
      courseToEdit.courseColor = courseColor;

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

const courses_deleteOneCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseToDelete = await Course_Model.findById(id);
    if (!courseToDelete) {
      return res.status(404).json({ message: "Curso não encontrado" });
    } else {
      const moduleIds = courseToDelete.modules;

      await Promise.all(
        moduleIds.map(async (moduleId) => {
          const moduleToDelete = await Module_Model.findById(moduleId);
          if (moduleToDelete) {
            const classIds = moduleToDelete.classes;
            await Promise.all(
              classIds.map(async (classId) => {
                const classToDelete = await Class_Model.findById(classId);
                if (classToDelete) {
                  await classToDelete.deleteOne();
                }
              })
            );
            await moduleToDelete.deleteOne();
          }
        })
      );

      await courseToDelete.deleteOne();

      res.status(200).json({
        message: "Curso, módulos e aulas excluídos com sucesso",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao excluir curso, módulos e aulas",
    });
  }
};

const courses_postOneModule = async (req, res) => {
  const { id } = req.params;
  const { moduleTitle } = req.body;
  try {
    const courseToPostModuleIn = await Course_Model.findById(id);
    if (!courseToPostModuleIn) {
      return res.status(400).json({ message: "Curso não existe" });
    } else if (!moduleTitle) {
      return res.status(400).json({ message: "Título do módulo faltando" });
    } else {
      const newModule = new Module_Model({
        moduleTitle,
      });
      await newModule.save();
      courseToPostModuleIn.modules.push(newModule);
      await courseToPostModuleIn.save();
      res.status(201).json({
        NewModule: newModule,
        UpdatedCourse: courseToPostModuleIn,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Módulo não postado",
    });
  }
};

const courses_editOneModule = async (req, res) => {
  const { moduleTitle } = req.body;
  const { id } = req.params;
  try {
    const moduleToEdit = await Module_Model.findById(id);

    if (!moduleToEdit) {
      return res.status(400).json({ message: "Módulo não existe" });
    } else {
      moduleToEdit.moduleTitle = moduleTitle;

      res.status(201).json({
        status: "Modulo editado com sucesso",
        moduleToEdit,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Modulo não editado",
    });
  }
};

const courses_getModulesFromOneCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course_Model.findById(id);

    if (!course) {
      return res.status(400).json({ message: "Curso não existe" });
    } else {
      const moduleIds = course.modules;

      const modulesWithClasses = await Promise.all(
        moduleIds.map(async (moduleId) => {
          const module = await Module_Model.findById(moduleId);

          if (!module) {
            return null;
          }

          await Module_Model.populate(module, {
            path: "classes",
            model: Class_Model,
          });

          return module;
        })
      );

      res.status(200).json({
        status: "Módulos encontrados com aulas",
        modules: modulesWithClasses,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao buscar módulos com aulas",
      error: error.message,
    });
  }
};

const courses_deleteOneModule = async (req, res) => {
  const { id } = req.params;
  try {
    const moduleToDelete = await Module_Model.findById(id);
    if (!moduleToDelete) {
      return res.status(400).json({ message: "Módulo não existe" });
    } else {
      const classIds = moduleToDelete.classes;

      await Promise.all(
        classIds.map(async (classId) => {
          const classToDelete = await Class_Model.findById(classId);
          if (classToDelete) {
            await classToDelete.deleteOne();
          }
        })
      );

      await moduleToDelete.deleteOne();

      res.status(201).json({
        status: "Módulo e aulas excluídos com sucesso",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Módulo e/ou aulas não excluídos",
    });
  }
};

const courses_postOneClass = async (req, res) => {
  const {
    classTitle,
    description,
    videoUrl,
    moduleTitle,
    courseTitle,
    partner,
    googleDriveLink,
  } = req.body;
  try {
    const newClass = new Class_Model({
      classTitle,
      description,
      videoUrl,
      moduleTitle,
      courseTitle,
      partner,
      googleDriveLink,
    });
    await newClass.save();
    res.status(201).json({
      NewClass: newClass,
    });
  } catch (error) {
    res.status(400).json({
      status: "Aula não postada",
    });
  }
};

const courses_editOneClass = async (req, res) => {
  const { id } = req.params;
  const {
    classTitle,
    description,
    videoUrl,
    moduleTitle,
    courseTitle,
    googleDriveLink,
  } = req.body;
  try {
    const classToEdit = await Class_Model.findById(id);
    if (!classToEdit) {
      return res.status(400).json({ message: "Aula não existe" });
    } else if (!classTitle) {
      return res.status(400).json({ message: "Título faltando" });
    } else {
      classToEdit.classTitle = classTitle;
      classToEdit.description = description;
      classToEdit.videoUrl = videoUrl;
      classToEdit.moduleTitle = moduleTitle;
      classToEdit.courseTitle = courseTitle;
      classToEdit.googleDriveLink = googleDriveLink;
      await classToEdit.save();
      res.status(201).json({
        status: "Aula atualizada",
        classToEdit,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Aula não editada",
    });
  }
};

const courses_getClassesFromOneModule = async (req, res) => {
  const { moduleTitle, courseTitle } = req.query;
  try {
    const classes = await Class_Model.find({
      moduleTitle,
      courseTitle,
    });

    res.json(classes);
  } catch (error) {
    console.error("Erro ao obter as aulas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
const courses_getCoursesTitles = async (req, res) => {
  const { partner } = req.query;
  const partnerNumber = new Number(partner);
  try {
    await Class_Model.deleteMany({ courseTitle: null });
    const classes = await Class_Model.find({
      $and: [{ courseTitle: { $ne: null } }, { partner: partnerNumber }],
    });
    const filteredClasses = classes.filter(
      (classItem) => classItem.courseTitle !== null
    );
    const uniqueCourseTitlesSet = new Set(
      filteredClasses.map((classItem) => classItem.courseTitle)
    );
    const uniqueCourseTitles = [...uniqueCourseTitlesSet];
    res.json(uniqueCourseTitles);
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const courses_getAllObjects = async (req, res) => {
  try {
    const classes = await Class_Model.find();
    console.log(classes);
    res.json(classes);
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const courses_getOneCourse = async (req, res) => {
  let { courseName } = req.query;

  try {
    const classesFromTheCourse = await Class_Model.find({
      courseTitle: courseName,
    });

    const groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    const groupedClasses = groupBy(classesFromTheCourse, "moduleTitle");
    const sortedModuleTitles = Object.keys(groupedClasses).sort();
    const resultArray = sortedModuleTitles.map((moduleTitle) => {
      return {
        moduleName: moduleTitle,
        classes: groupedClasses[moduleTitle],
      };
    });

    res.json(resultArray);
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const courses_deleteOneClass = async (req, res) => {
  const { id } = req.params;
  try {
    const classToDelete = await Class_Model.findById(id);
    if (!classToDelete) {
      return res.status(400).json({ message: "Aula não existe" });
    } else {
      await classToDelete.deleteOne();

      res.status(201).json({
        status: "Aula excluída com sucesso",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Aula não excluído",
    });
  }
};
const deleteAllBut = async (req, res) => {
  const { courseTitle } = req.query;

  try {
    // Find all classes whose courseTitle is not equal to the provided courseTitle
    const classesToDelete = await Class_Model.find({
      courseTitle: { $ne: courseTitle },
    });

    if (classesToDelete.length === 0) {
      return res.status(400).json({ message: "No classes found for deletion" });
    }

    // Delete all classes found
    await Class_Model.deleteMany({
      _id: { $in: classesToDelete.map((cls) => cls._id) },
    });

    res.status(201).json({
      status: "Classes successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "Error deleting classes",
    });
  }
};

module.exports = {
  courses_postOneCourse,
  courses_getAll,
  courses_getOne,
  courses_editOneCourse,
  courses_deleteOneCourse,
  courses_postOneModule,
  courses_getModulesFromOneCourse,
  courses_editOneModule,
  courses_deleteOneModule,
  courses_postOneClass,
  courses_getClassesFromOneModule,
  courses_editOneClass,
  courses_deleteOneClass,
  courses_getCoursesTitles,
  courses_getOneCourse,
  courses_getAllObjects,
};
