"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);

const authenticateJwt = require(`../../middlewares/authenticate-jwt`);
const isUserAdmin = require(`../../middlewares/is-user-admin`);

const routeParameterValidator = require(`../../middlewares/route-parameter-validator`);
const routeParameterSchema = require(`../../schemas/route-parameter`);

const articleExists = require(`../../middlewares/article-exists`);
const articleValidator = require(`../../middlewares/article-validator`);
const articleSchema = require(`../../schemas/article`);

module.exports = ({
  app,
  articleService,
  commentService,
  categoryService,
  logger,
} = {}) => {
  const route = new Router();

  const isRouteParameterValid = routeParameterValidator(
    routeParameterSchema,
    logger
  );
  const isArticleExists = articleExists(articleService, logger);

  const isArticleValid = articleValidator(
    articleSchema,
    categoryService,
    logger
  );

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const { comments = false, limit = null, offset = null } = req.query;

    const result =
      limit || offset
        ? await articleService.findPage({ limit, offset, comments })
        : await articleService.findAll({ comments });

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/popular`, async (req, res) => {
    const { limit } = req.query;
    const popularArticles = await articleService.findAllPopular(limit);

    return res.status(HttpCode.OK).json(popularArticles);
  });

  route.post(
    `/`,
    [authenticateJwt, isUserAdmin, isArticleValid],
    async (req, res) => {
      const article = await articleService.create(req.body);

      return res.status(HttpCode.CREATED).json(article);
    }
  );

  route.get(
    `/:articleId`,
    [isRouteParameterValid, isArticleExists],
    async (req, res) => {
      const { article } = res.locals;

      return res.status(HttpCode.OK).json(article);
    }
  );

  route.get(
    `/category/:categoryId`,
    isRouteParameterValid,
    async (req, res) => {
      const { categoryId } = req.params;
      const { offset, limit } = req.query;

      const result =
        limit || offset
          ? await articleService.findPageByCategory(categoryId, {
              limit,
              offset,
            })
          : await articleService.findAllByCategory(categoryId);

      return res.status(HttpCode.OK).json(result);
    }
  );

  route.put(
    `/:articleId`,
    [
      authenticateJwt,
      isUserAdmin,
      isRouteParameterValid,
      isArticleExists,
      isArticleValid,
    ],
    async (req, res) => {
      const { article } = res.locals;
      const updated = await articleService.update(article.id, req.body);

      return res.status(HttpCode.OK).json(updated);
    }
  );

  route.delete(
    `/:articleId`,
    [authenticateJwt, isUserAdmin, isRouteParameterValid, isArticleExists],
    async (req, res) => {
      const { io } = req.app.locals;
      const { article } = res.locals;
      const deleted = await articleService.delete(article.id);

      const popularArticles = await articleService.findAllPopular();
      io.emit(`popular-articles`, popularArticles);

      const lastComments = await commentService.findAllLast();
      io.emit(`last-comments`, lastComments);

      return res.status(HttpCode.OK).json(deleted);
    }
  );
};
