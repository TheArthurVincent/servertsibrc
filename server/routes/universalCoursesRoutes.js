const router = require("express").Router();

const studentController = require("../controllers/universalCoursesController");

router
  .route("/universalcourses")
  .post((req, res) => studentController.create(req, res));
router
  .route("/universalcourses")
  .get((req, res) => studentController.find(req, res));
router
  .route("/universalcourses")
  .put((req, res) => studentController.update(req, res));
router
  .route("/universalcourses")
  .delete((req, res) => studentController.delete(req, res));

module.exports = router;
