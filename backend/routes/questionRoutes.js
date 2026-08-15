const express = require("express");
const router = express.Router();
const {startInterview, getCurrentQuestion, submitAnswer, nextQuestion, completeInterview, getInterviewResult, resultHistory} = require("../controllers/questionController");
const auth = require("../middlewares/auth");

router.post("/:interviewId/start", auth, startInterview);
router.get("/:interviewId/current", auth, getCurrentQuestion);
router.post("/:questionId/answer", auth, submitAnswer);
router.post("/:interviewId/next", auth, nextQuestion)
router.post("/:interviewId/complete", auth, completeInterview)
router.get("/:interviewId/result", auth, getInterviewResult)

module.exports = router;