const {
  CourseClass_Model,
  CourseInfo_Model,
} = require("../models/CourseClass");
const { Blog_Model } = require("../models/Posts");

const courseClasses_getAll = async (req, res) => {
  try {
    const classesDetails = await CourseClass_Model.find();

    if (!classesDetails) {
      return res.status(404).json({ error: "Aulas não encontrada" });
    }

    res.json({ totalOfClasses: classesDetails.length, classesDetails });
  } catch (error) {
    console.error("Erro ao obter os detalhes da aula:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const courseClasses_getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const classDetails = await CourseClass_Model.findById(id);

    if (!classDetails) {
      return res.status(404).json({ error: "Aula não encontrada" });
    }

    res.json(classDetails);
  } catch (error) {
    console.error("Erro ao obter os detalhes da aula:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const courseClasses_postMultipleClasses = async (req, res) => {
  const classes = req.body.theClass;

  if (!Array.isArray(classes) || classes.length === 0) {
    return res.status(400).json({ message: "Nenhuma aula fornecida" });
  }

  try {
    const newClasses = await Promise.all(
      classes.map(async (classItem) => {
        const {
          title,
          module,
          order,
          description,
          image,
          video,
          elements } =
          classItem;

        if (!title) {
          throw new Error("Título faltando");
        } else if (!module) {
          throw new Error("Módulo faltando");
        } else if (!order) {
          throw new Error("Ordem faltando");
        }

        const moduleTitle = CourseInfo_Model.findById(module);

        const newClass = new CourseClass_Model({
          title,
          module: moduleTitle.title ? moduleTitle.title : module,
          order,
          description: description ? description : `${title} | ${module}`,
          image: image ? image : null,
          video: video ? video : null,
          elements: elements ? elements : null,
        });

        await newClass.save();

        return { newClass };
      })
    );

    console.log(newClasses);
    res.status(201).json(newClasses);
  } catch (error) {
    res.status(400).json({
      status: "Uma ou mais aulas não foram postadas",
      message: error.message,
    });
  }
};

const courseClasses_postNewCourse = async (req, res) => {
  const { title, image } = req.body.theCourse;

  try {
    const newCourse = new CourseInfo_Model({
      title,
      image: image ? image : null,
    });
    newCourse.save();
    console.log(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({
      status: "Uma ou mais aulas não foram postadas",
      message: error.message,
    });
  }
};

module.exports = {
  courseClasses_getAll,
  courseClasses_getOne,
  courseClasses_postMultipleClasses,
  courseClasses_postNewCourse,
};
