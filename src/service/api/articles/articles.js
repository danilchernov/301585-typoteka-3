"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);
const { articleValidator, articleExist } = require(`../../middlewares`);

module.exports = (api, articleService, commentsRouter) => {
  const route = new Router();
  api.use(`/articles`, route);

  route.use(
    `/:articleId/comments`,
    articleExist(articleService),
    commentsRouter
  );

  route.get(`/`, async (req, res) => {
    const { comments = false, limit = null, offset = null } = req.query;
    let result;

    if (limit || offset) {
      result = await articleService.findPage({ limit, offset, comments });
    } else {
      result = await articleService.findAll({ comments });
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, articleExist(articleService), async (req, res) => {
    const { article } = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.put(
    `/:articleId`,
    [articleExist(articleService), articleValidator],
    async (req, res) => {
      const { article } = res.locals;
      const updatedArticle = await articleService.update(article.id, req.body);

      return res.status(HttpCode.OK).json(updatedArticle);
    }
  );

  route.delete(
    `/:articleId`,
    articleExist(articleService),
    async (req, res) => {
      const { article } = res.locals;
      const deletedArticle = await articleService.delete(article.id);

      return res.status(HttpCode.OK).json(deletedArticle);
    }
  );
};
