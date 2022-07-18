"use strict";

const { Sequelize } = require(`sequelize`);

const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);

    return category && category.get();
  }

  async update(id, categoryData) {
    const [affectedRows] = await this._Category.update(categoryData, {
      where: { id },
    });

    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: { id },
    });

    return !!deletedRows;
  }

  async findOne(id) {
    return await this._Category.findByPk(id);
  }

  async findByName(name) {
    const category = await this._Category.findOne({
      where: { name },
    });

    return category && category.get();
  }

  async findAll({ count } = {}) {
    if (count) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, Sequelize.col(`ArticleId`)), `count`],
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [
          {
            model: this._ArticleCategory,
            as: Alias.ARTICLES_CATEGORIES,
            attributes: [],
          },
        ],
        order: [[`count`, `DESC`]],
      });

      return result.map((it) => it.get());
    } else {
      return await this._Category.findAll({
        raw: true,
      });
    }
  }

  async hasArticle(categoryId) {
    return !!(await this._ArticleCategory.findOne({
      where: { CategoryId: categoryId },
      raw: true,
    }));
  }
}

module.exports = CategoryService;
