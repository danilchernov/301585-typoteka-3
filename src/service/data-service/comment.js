"use strict";

const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../../constants`);

class CommentService {
  create(comment, article) {
    const newComment = Object.assign({ id: nanoid(MAX_ID_LENGTH) }, comment);

    article.comments.push(newComment);

    return newComment;
  }

  delete(id, article) {
    const comment = this.findOne(id, article);

    if (!comment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== id);

    return comment;
  }

  findOne(id, article) {
    return article.comments.find((comment) => comment.id === id);
  }

  findAll(article) {
    return article.comments;
  }
}

module.exports = CommentService;
