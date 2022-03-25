"use strict";

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../constants`);
const { commentValidator, commentExist } = require(`../middlewares`);

module.exports = (commentService) => {
  const route = new Router({ mergeParams: true });

  route.get(`/`, async (req, res) => {
    const { article } = res.locals;
    const comments = await commentService.findAll(article);
    return res.status(HTTP_CODE.OK).json(comments);
  });

  route.post(`/`, commentValidator, async (req, res) => {
    const { article } = res.locals;
    const comment = await commentService.create(req.body, article);

    return res.status(HTTP_CODE.CREATED).json(comment);
  });

  route.delete(
    `/:commentId`,
    commentExist(commentService),
    async (req, res) => {
      const { comment, article } = res.locals;
      const deletedComment = await commentService.delete(comment.id, article);

      return res.status(HTTP_CODE.OK).json(deletedComment);
    }
  );

  return route;
};
