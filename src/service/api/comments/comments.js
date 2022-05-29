"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);

const routeParameterValidator = require(`../../middlewares/route-parameter-validator`);
const routeParameterSchema = require(`../../schemas/route-parameter`);

const commentValidator = require(`../../middlewares/comment-validator`);
const commentSchema = require(`../../schemas/comment`);

module.exports = (commentService, logger) => {
  const route = new Router({ mergeParams: true });
  const isRouteParameterValid = routeParameterValidator(
    routeParameterSchema,
    logger
  );
  const isCommentValid = commentValidator(commentSchema, logger);

  route.use(`/:commentId`, isRouteParameterValid);

  route.get(`/`, async (req, res) => {
    const { article } = res.locals;
    const comments = await commentService.findAll(article.id);
    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/`, isCommentValid, async (req, res) => {
    const { article } = res.locals;
    const comment = await commentService.create(req.body, article.id);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:commentId`, async (req, res) => {
    const { commentId } = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      logger.error(
        `[${req.method}] Comment with id "${commentId}" not found ${req.originalUrl}`
      );

      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });

  return route;
};
