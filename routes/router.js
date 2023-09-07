const router = require("express").Router();

// Students Router
const studentsRouter = require("./studentsRoutes");
router.use("/", studentsRouter);

module.exports = router;
