// routes/comment.route.js

const router = require("express").Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    createComment,
    getTaskComments,
    deleteComment,
    updateComment,
} = require("../controllers/commentController");

router.post("/create", verifyToken, createComment);
router.get("/:taskId", verifyToken, getTaskComments);
router.delete("/:commentId", verifyToken, deleteComment);
router.put("/:commentId", verifyToken, updateComment);
module.exports = router;