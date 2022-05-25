"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);
const { articleValidator } = require(`../../middlewares`);
const articleExists = require(`../../middlewares/article-exists`);

module.exports = (api, articleService, commentsRouter, logger) => {
  const route = new Router();
  const isArticleExists = articleExists(articleService, logger);

  api.use(`/articles`, route);

  route.use(`/:articleId/comments`, isArticleExists, commentsRouter);

  route.get(`/`, async (req, res) => {
    const { comments = false, limit = null, offset = null } = req.query;
    let result;

    result =
      limit || offset
        ? await articleService.findPage({ limit, offset, comments })
        : await articleService.findAll({ comments });

    return res.status(HttpCode.OK).json(result);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, isArticleExists, async (req, res) => {
    const { article } = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.put(
    `/:articleId`,
    [isArticleExists, articleValidator],
    async (req, res) => {
      const { article } = res.locals;
      const updatedArticle = await articleService.update(article.id, req.body);

      return res.status(HttpCode.OK).json(updatedArticle);
    }
  );

  route.delete(`/:articleId`, isArticleExists, async (req, res) => {
    const { article } = res.locals;
    const deletedArticle = await articleService.delete(article.id);

    return res.status(HttpCode.OK).json(deletedArticle);
  });
};
