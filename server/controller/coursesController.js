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

      const modulePromises = moduleIds.map(async (moduleId) => {
        const module = await Module_Model.findById(moduleId);
        return module;
      });

      const modules = await Promise.all(modulePromises);

      res.status(200).json({
        status: "Módulos encontrados",
        modules,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao buscar módulos",
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
      await moduleToDelete.deleteOne();

      res.status(201).json({
        status: "Modulo excluído com sucesso",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Modulo não excluído",
    });
  }
};

const courses_postOneClass = async (req, res) => {
  const { id } = req.params;
  const { classTitle, description, srcVideos, srcAttachments } = req.body;
  try {
    const moduleToPostClassIn = await Module_Model.findById(id);
    if (!moduleToPostClassIn) {
      return res.status(400).json({ message: "Módulo não existe" });
    } else if (!classTitle || !description) {
      return res
        .status(400)
        .json({ message: "Título do módulo ou descrição faltando" });
    } else {
      const newClass = new Class_Model({
        classTitle,
        description,
        srcVideos,
        srcAttachments,
      });
      await newClass.save();
      moduleToPostClassIn.classes.push(newClass);
      await moduleToPostClassIn.save();
      res.status(201).json({
        NewClass: newClass,
        UpdatedModule: moduleToPostClassIn,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Aula não postada",
    });
  }
};

const courses_editOneClass = async (req, res) => {
  const { id } = req.params;
  const { classTitle, description, srcVideos, srcAttachments } = req.body;
  try {
    const classToEdit = await Class_Model.findById(id);
    if (!classToEdit) {
      return res.status(400).json({ message: "Aula não existe" });
    } else if (!classTitle || !description) {
      return res
        .status(400)
        .json({ message: "Título do módulo ou descrição faltando" });
    } else {
      classToEdit.classTitle = classTitle;
      classToEdit.description = description;
      classToEdit.srcVideos = srcVideos;
      classToEdit.srcAttachments = srcAttachments;
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
  const { id } = req.params;
  try {
    const module = await Module_Model.findById(id);

    if (!module) {
      return res.status(400).json({ message: "Módulo não existe" });
    } else {
      const classIds = module.classes;

      const classPromises = classIds.map(async (classId) => {
        const theClass = await Class_Model.findById(classId);
        return theClass;
      });

      const classes = await Promise.all(classPromises);

      res.status(200).json({
        status: "Classes encontradas",
        classes,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Erro ao buscar aulas",
      error: error.message,
    });
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
};
