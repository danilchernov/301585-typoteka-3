"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);

const authenticateJwt = require(`../../middlewares/authenticate-jwt`);
const isUserAdmin = require(`../../middlewares/is-user-admin`);

const routeParameterValidator = require(`../../middlewares/route-parameter-validator`);
const routeParameterSchema = require(`../../schemas/route-parameter`);

const categoryExists = require(`../../middlewares/category-exists`);
const categoryHasArticle = require(`../../middlewares/category-has-article`);

const categoryHasUniqueName = require(`../../middlewares/category-has-unique-name`);
const categoryValidator = require(`../../middlewares/category-validator`);
const categorySchema = require(`../../schemas/category`);

module.exports = ({ app, categoryService, logger } = {}) => {
  const route = new Router();

  const isRouteParameterValid = routeParameterValidator(
    routeParameterSchema,
    logger
  );

  const isCategoryExists = categoryExists(categoryService, logger);
  const isCategoryHasArticle = categoryHasArticle(categoryService, logger);

  const isCategoryHasUniqueName = categoryHasUniqueName(
    categoryService,
    logger
  );
  const isCategoryValid = categoryValidator(categorySchema, logger);

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const { count = false } = req.query;
    const categories = await categoryService.findAll({ count });

    return res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:categoryId`, isRouteParameterValid, async (req, res) => {
    const { categoryId } = req.params;
    const category = await categoryService.findOne(categoryId);

    return res.status(HttpCode.OK).json(category);
  });

  route.post(
    `/`,
    [authenticateJwt, isUserAdmin, isCategoryValid, isCategoryHasUniqueName],
    async (req, res) => {
      const category = await categoryService.create(req.body);

      return res.status(HttpCode.CREATED).json(category);
    }
  );

  route.put(
    `/:categoryId`,
    [
      authenticateJwt,
      isUserAdmin,
      isRouteParameterValid,
      isCategoryExists,
      isCategoryValid,
      isCategoryHasUniqueName,
    ],
    async (req, res) => {
      const { categoryId } = req.params;
      const updated = await categoryService.update(categoryId, req.body);

      return res.status(HttpCode.OK).send(updated);
    }
  );

  route.delete(
    `/:categoryId`,
    [
      authenticateJwt,
      isUserAdmin,
      isRouteParameterValid,
      isCategoryExists,
      isCategoryHasArticle,
    ],
    async (req, res) => {
      const { categoryId } = req.params;
      const deleted = await categoryService.delete(categoryId);

      return res.status(HttpCode.OK).json(deleted);
    }
  );
};
