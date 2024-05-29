const Comment = require("./Comments");
const saveComment = async (req, res) => {
  const { postId, text, userId } = req.body;
  try {
    const newComment = new Comment({
      postId: postId,
      text: text,
      userId: userId
    });
    await newComment.save();
    res.status(201).json({ message: "Comment saved successfully", comment: newComment });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ error: "An error occurred while saving the comment" });
  }
};

module.exports = {
  saveComment,
};