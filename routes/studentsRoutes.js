const router = require("express").Router();

const studentController = require("../controllers/studentsController");

router
  .route("/students")
  .post((req, res) => studentController.create(req, res));
router.route("/students").get((req, res) => studentController.find(req, res));
router.route("/students").put((req, res) => studentController.update(req, res));
router
  .route("/students")
  .delete((req, res) => studentController.delete(req, res));

module.exports = router;
