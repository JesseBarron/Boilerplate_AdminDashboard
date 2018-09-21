const router = require("express").Router();

module.exports = router;

router.use("/users", require("./user"));
router.use("/address", require("./address"));