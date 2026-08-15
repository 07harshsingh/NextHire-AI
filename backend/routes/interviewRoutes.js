const express = require("express");
const router = express.Router();
const {interviewController, getAllInterview, getInterviewById, updateInterview, deleteInterview, resultHistory} = require("../controllers/interviewController");
const auth = require("../middlewares/auth")

router.post("/",auth, interviewController);
router.get("/", auth, getAllInterview);
router.get("/result/history", auth, resultHistory)
router.get("/:id", auth, getInterviewById);
router.put("/:id", auth, updateInterview);
router.delete("/:id", auth, deleteInterview);

module.exports = router;

