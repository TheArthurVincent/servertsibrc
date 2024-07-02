const {
  CourseClass_Model,
  CourseInfo_Model,
  ModulesInfo_Model,
} = require("../models/CourseClass");

const courseClasses_getAll = async (req, res) => {
  const { studentId } = req.params
  try {
    const classesDetails = await CourseClass_Model.find();
    const coursesYes = await CourseInfo_Model.find({ studentsWhoHaveAccessToIt: studentId });
    const coursesNo = await CourseInfo_Model.find({ studentsWhoHaveAccessToIt: { $ne: studentId } });

    const modules = await ModulesInfo_Model.find();

    if (!classesDetails) {
      return res.status(404).json({ error: "Aulas não encontradas" });
    }

    const transformAuthClassesByCourse = (classes, courses, modules) => {
      const coursesMap = courses.reduce((acc, course) => {
        acc[course._id] = { ...course.toObject(), modules: {} };
        return acc;
      }, {});

      const modulesMap = modules.reduce((acc, module) => {
        acc[module._id] = { title: module.title, order: module.order };
        return acc;
      }, {});

      classes.forEach((lesson) => {
        const course = coursesMap[lesson.courseId];
        if (!course) return;

        const moduleInfo = modulesMap[lesson.module];
        if (!moduleInfo) return;

        if (!course.modules[lesson.module]) {
          course.modules[lesson.module] = [];
        }
        course.modules[lesson.module].push(lesson);
      });

      const sortModulesByOrder = (modules) => {
        return Object.entries(modules)
          .sort((a, b) => modulesMap[a[0]].order - modulesMap[b[0]].order)
          .map(([moduleId, lessons]) => ({
            module: modulesMap[moduleId]?.title || "Título não encontrado",
            lessons: lessons.sort((a, b) => a.order - b.order)
          }));
      };

      return Object.values(coursesMap).map((course) => ({
        ...course,
        modules: sortModulesByOrder(course.modules),
      }));
    };
    const transformNonAuthClassesByCourse = (classes, courses, modules) => {
      const coursesMap = courses.reduce((acc, course) => {
        acc[course._id] = { ...course.toObject(), modules: {} };
        return acc;
      }, {});

      const modulesMap = modules.reduce((acc, module) => {
        acc[module._id] = { title: module.title, order: module.order };
        return acc;
      }, {});

      classes.forEach((lesson) => {
        const course = coursesMap[lesson.courseId];
        if (!course) return;

        const moduleInfo = modulesMap[lesson.module];
        if (!moduleInfo) return;

        if (!course.modules[lesson.module]) {
          course.modules[lesson.module] = [];
        }
        course.modules[lesson.module].push({ title: "No Access" });
      });

      const sortModulesByOrder = (modules) => {
        return Object.entries(modules)
          .sort((a, b) => modulesMap[a[0]].order - modulesMap[b[0]].order)
          .map(([moduleId, lessons]) => ({
            module: modulesMap[moduleId]?.title || "Título não encontrado",
            lessons,
          }));
      };

      return Object.values(coursesMap).map((course) => ({
        ...course,
        modules: sortModulesByOrder(course.modules),
      }));
    };


    const groupedAuthClasses = transformAuthClassesByCourse(
      classesDetails,
      coursesYes,
      modules
    );
    const groupedNonAuthClasses = transformNonAuthClassesByCourse(
      classesDetails,
      coursesNo,
      modules
    );

    res.status(200).json({
      totalOfClasses: classesDetails.length,
      courses: groupedAuthClasses,
      coursesNonAuth: groupedNonAuthClasses,
    });
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

  const allClasses = await CourseClass_Model.find();

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
          elements,
          courseId,
        } = classItem;

        const theOrder = order ? order : allClasses.length + 1;

        const newClass = new CourseClass_Model({
          title,
          module,
          order: theOrder,
          courseId,
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
      message: error,
    });
  }
};
const courseClasses_postNewCourse = async (req, res) => {
  const { title, image, order } = req.body;

  try {
    const numberOfCourses = await CourseInfo_Model.find();
    let adjustedOrder = order !== undefined ? order : numberOfCourses.length;

    const existingCourse = await CourseInfo_Model.findOne({
      order: adjustedOrder,
    });

    if (existingCourse) {
      existingCourse.order = numberOfCourses.length;
      await existingCourse.save();
    }

    const newCourse = new CourseInfo_Model({
      title,
      image: image ? image : null,
      order: adjustedOrder,
    });

    await newCourse.save();
    console.log(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({
      status: "Curso não postado",
      message: error.message,
    });
  }
};

const courseClasses_postNewModule = async (req, res) => {
  const { title, order, courseId } = req.body;

  const ExistingModules = await ModulesInfo_Model.find({ courseId });

  try {
    const newModule = new ModulesInfo_Model({
      title,
      courseId,
      order: order ? order : ExistingModules.length,
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
  courseClasses_postNewModule,
};
