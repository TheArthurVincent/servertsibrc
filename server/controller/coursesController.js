const {
  CourseClass_Model,
  CourseInfo_Model,
  ModulesInfo_Model,
} = require("../models/CourseClass");

const courseClasses_getAll = async (req, res) => {
  try {
    const classesDetails = await CourseClass_Model.find();

    if (!classesDetails) {
      return res.status(404).json({ error: "Aulas não encontradas" });
    }

    const courses = await CourseInfo_Model.find();
    const modules = await ModulesInfo_Model.find();

    const transformClassesByCourse = (classes, courses, modules) => {
      const coursesMap = courses.reduce((acc, course) => {
        acc[course._id] = { ...course.toObject(), modules: {} };
        return acc;
      }, {});

      const modulesMap = modules.reduce((acc, module) => {
        acc[module._id] = module.title;
        return acc;
      }, {});

      classes.forEach((lesson) => {
        const course = coursesMap[lesson.courseId];
        if (!course.modules[lesson.module]) {
          course.modules[lesson.module] = [];
        }
        course.modules[lesson.module].push(lesson);
      });

      const sortModulesByOrder = (modules) => {
        return Object.entries(modules)
          .sort((a, b) => a[1][0].moduleOrder - b[1][0].moduleOrder)
          .map(([module, lessons]) => ({
            module: modulesMap[module] || 'Título não encontrado',
            lessons,
          }));
      };

      return Object.values(coursesMap).map((course) => ({
        ...course,
        modules: sortModulesByOrder(course.modules),
      }));
    };

    const groupedClasses = transformClassesByCourse(classesDetails, courses, modules);

    res.json({ totalOfClasses: classesDetails.length, courses: groupedClasses });
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

  const allClasses = await CourseClass_Model.find()

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

        const moduleTitle = CourseInfo_Model.findById(module);

        const theOrder = order ? order : allClasses.length + 1

        const newClass = new CourseClass_Model({
          title: title ? title : moduleTitle.title,
          module: moduleTitle.title ? moduleTitle.title : module,
          order: theOrder,
          description: description ? description : `${title} | ${module}`,
          image: image ? image : null,
          video: video ? video : null,
          elements: elements ? elements : null,
        });

        await newClass.save();

        return newClass;
      })
    );

    res.status(201).json(newClasses);
  } catch (error) {
    res.status(400).json({
      status: "Uma ou mais aulas não foram postadas",
      message: error.message,
    });
  }
};

const courseClasses_postNewCourse = async (req, res) => {
  const { title, image } = req.body;

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

const courseClasses_postNewModule = async (req, res) => {
  const { title, order, courseId } = req.body;

  const ExistingModules = await ModulesInfo_Model.find({ courseId })

  try {
    const newModule = new ModulesInfo_Model({
      title,
      courseId,
      order: order ? order : ExistingModules.length + 1,
    });
    newModule.save();
    res.status(201).json(newModule);
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
  courseClasses_postNewModule
};
