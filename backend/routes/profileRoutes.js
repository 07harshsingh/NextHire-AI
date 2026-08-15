const express = require("express");
const router = express.Router();
const {createProfile, getMyProfile, updateProfile, deleteProfile, uploadResume} = require("../controllers/profileController");
const auth = require("../middlewares/auth")
const upload = require("../middlewares/upload")

router.post("/", auth, createProfile);
router.get("/me",auth, getMyProfile);
router.put("/", auth, updateProfile);
router.delete("/", auth, deleteProfile)
router.post("/upload-resume", auth, upload.single("resume"), uploadResume)

module.exports = router;