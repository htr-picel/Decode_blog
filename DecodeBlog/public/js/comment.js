function sendRate(e) {
  e.preventDefault();
  const comment_text = document.querySelector("#comment-text").value;
  const author = document.querySelector("#comment_author").value;
  const blog = document.querySelector("#comment_blog").value;
  console.log(comment_text, author, blog);

  if (comment_text.length > 0) {
    axios
      .post("/api/comment", {
        text: comment_text,
        blogId: blog,
        authorId: author,
      })
      .then((date) => {
        if (date.date) {
          location.reload();
        }
      });
  }
}
