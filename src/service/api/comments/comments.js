"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);
const { commentValidator, commentExist } = require(`../../middlewares`);

module.exports = (commentService) => {
  const route = new Router({ mergeParams: true });

  route.get(`/`, async (req, res) => {
    const { article } = res.locals;
    const comments = await commentService.findAll(article.id);
    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/`, commentValidator, async (req, res) => {
    const { article } = res.locals;
    const comment = await commentService.create(req.body, article.id);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(
    `/:commentId`,
    commentExist(commentService),
    async (req, res) => {
      const { comment } = res.locals;
      const deletedComment = await commentService.delete(comment.id);

      return res.status(HttpCode.OK).json(deletedComment);
    }
  );

  return route;
};
