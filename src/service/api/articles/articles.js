"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);

const authenticateJwt = require(`../../middlewares/authenticate-jwt`);

const routeParameterValidator = require(`../../middlewares/route-parameter-validator`);
const routeParameterSchema = require(`../../schemas/route-parameter`);

const articleExists = require(`../../middlewares/article-exists`);
const articleValidator = require(`../../middlewares/article-validator`);
const articleSchema = require(`../../schemas/article`);

module.exports = (
  api,
  articleService,
  CategoryService,
  commentsRouter,
  logger
) => {
  const route = new Router();

  const isRouteParameterValid = routeParameterValidator(
    routeParameterSchema,
    logger
  );
  const isArticleExists = articleExists(articleService, logger);
  const isArticleValid = articleValidator(
    articleSchema,
    CategoryService,
    logger
  );

  api.use(`/articles`, route);
  route.use(`/:articleId`, isRouteParameterValid);
  route.use(`/:articleId/comments`, isArticleExists, commentsRouter);

  route.get(`/`, async (req, res) => {
    const { comments = false, limit = null, offset = null } = req.query;

    const result =
      limit || offset
        ? await articleService.findPage({ limit, offset, comments })
        : await articleService.findAll({ comments });

    return res.status(HttpCode.OK).json(result);
  });

  route.post(`/`, [authenticateJwt, isArticleValid], async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, isArticleExists, async (req, res) => {
    const { article } = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.put(
    `/:articleId`,
    [authenticateJwt, isArticleExists, isArticleValid],
    async (req, res) => {
      const { article } = res.locals;
      const updatedArticle = await articleService.update(article.id, req.body);

      return res.status(HttpCode.OK).json(updatedArticle);
    }
  );

  route.delete(
    `/:articleId`,
    [authenticateJwt, isArticleExists],
    async (req, res) => {
      const { article } = res.locals;
      const deletedArticle = await articleService.delete(article.id);

      return res.status(HttpCode.OK).json(deletedArticle);
    }
  );
};
