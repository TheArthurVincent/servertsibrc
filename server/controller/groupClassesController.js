const { GroupClass_Model } = require("../models/GroupClass");
const { Homework_Model } = require("../models/Homework");
const { Blog_Model } = require("../models/Posts");

const groupClasses_getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const classDetails = await GroupClass_Model.findById(id);

    if (!classDetails) {
      return res.status(404).json({ error: "Aula não encontrada" });
    }

    res.json(classDetails);
  } catch (error) {
    console.error("Erro ao obter os detalhes da aula:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const groupClasses_postOneClass = async (req, res) => {
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
    const newClass = new GroupClass_Model({
      classTitle,
      description,
      videoUrl,
      moduleTitle,
      courseTitle,
      partner,
      googleDriveLink,
      createrAt: new Date(),
    });


    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    function addOneDay(dateString) {
      let date = new Date(dateString);

      date.setDate(date.getDate() + 1);

      let newDateString = date.toISOString().split('T')[0];

      return newDateString;
    }



    const newHomework = new Homework_Model({
      description,
      videoUrl,
      googleDriveLink,
      category: "groupclass",
      dueDate: addOneDay(dueDate),
      assignmentDate: addOneDay(today),
    });
    const newBlogPost = new Blog_Model({
      title: `Group Class: ${classTitle}`,
      videoUrl,
      text: `Última aula em grupo ao vivo: ${description}`,
    });

    await newBlogPost.save();
    await newHomework.save();
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

const groupClasses_editOneClass = async (req, res) => {
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
    const classToEdit = await GroupClass_Model.findById(id);
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

const groupClasses_getClassesFromOneModule = async (req, res) => {
  const { moduleTitle, courseTitle } = req.query;
  try {
    const classes = await GroupClass_Model.find({
      moduleTitle,
      courseTitle,
    });

    res.json(classes);
  } catch (error) {
    console.error("Erro ao obter as aulas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
const groupClasses_getCoursesTitles = async (req, res) => {
  const { partner } = req.query;
  const partnerNumber = new Number(partner);
  try {
    await GroupClass_Model.deleteMany({ courseTitle: null });
    const classes = await GroupClass_Model.find({
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

const groupClasses_getAllObjects = async (req, res) => {
  try {
    const classes = await GroupClass_Model.find().sort({ createdAt: -1 });
    res.json(classes.reverse());
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const groupClasses_getOneCourse = async (req, res) => {
  let { courseName } = req.query;

  try {
    const classesFromTheCourse = await GroupClass_Model.find({
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

const groupClasses_deleteOneClass = async (req, res) => {
  const { id } = req.params;
  try {
    const classToDelete = await GroupClass_Model.findById(id);
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
  groupClasses_getOne,
  groupClasses_postOneClass,
  groupClasses_getClassesFromOneModule,
  groupClasses_editOneClass,
  groupClasses_deleteOneClass,
  groupClasses_getCoursesTitles,
  groupClasses_getOneCourse,
  groupClasses_getAllObjects,
};
