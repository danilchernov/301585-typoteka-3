"use strict";

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../constants`);
const {
  articleValidator,
  articleExist,
  commentValidator,
  commentExist,
} = require(`../middlewares`);
const route = new Router();

module.exports = (api, articleService, commentService) => {
  api.use(`/articles`, route);

  route.get(
    `/:articleId/comments`,
    articleExist(articleService),
    async (req, res) => {
      const { article } = res.locals;
      const comments = await commentService.findAll(article);
      return res.status(HTTP_CODE.OK).json(comments);
    }
  );

  route.post(
    `/:articleId/comments`,
    [articleExist(articleService), commentValidator],
    async (req, res) => {
      const { article } = res.locals;
      const comment = await commentService.create(req.body, article);

      return res.status(HTTP_CODE.CREATED).json(comment);
    }
  );

  route.delete(
    `/:articleId/comments/:commentId`,
    [articleExist(articleService), commentExist(commentService)],
    async (req, res) => {
      const { comment, article } = res.locals;
      const deletedComment = await commentService.delete(comment.id, article);

      return res.status(HTTP_CODE.OK).json(deletedComment);
    }
  );

  route.get(`/`, async (req, res) => {
    const categories = await articleService.findAll();
    return res.status(HTTP_CODE.OK).json(categories);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const offer = await articleService.create(req.body);

    return res.status(HTTP_CODE.CREATED).json(offer);
  });

  route.get(`/:articleId`, articleExist(articleService), async (req, res) => {
    const { article } = res.locals;

    return res.status(HTTP_CODE.OK).json(article);
  });

  route.put(
    `/:articleId`,
    [articleExist(articleService), articleValidator],
    async (req, res) => {
      const { article } = res.locals;
      const updatedArticle = await articleService.update(article.id, req.body);

      return res.status(HTTP_CODE.OK).json(updatedArticle);
    }
  );

  route.delete(
    `/:articleId`,
    articleExist(articleService),
    async (req, res) => {
      const { article } = res.locals;
      const deletedArticle = await articleService.delete(article.id);

      return res.status(HTTP_CODE.OK).json(deletedArticle);
    }
  );
};
