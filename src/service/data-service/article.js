"use strict";

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({ where: { id } });
    return !!deletedRows;
  }

  async findOne(id) {
    return await this._Article.findByPk(id, { include: [Alias.CATEGORIES] });
  }

  async findAll({ comments } = {}) {
    const include = [Alias.CATEGORIES];

    if (comments) {
      include.push(Alias.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((item) => item.get());
  }

  async findPage({ comments, limit, offset } = {}) {
    const include = [Alias.CATEGORIES];

    if (comments) {
      include.push(Alias.COMMENTS);
    }

    const { count, rows } = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [[`createdAt`, `DESC`]],
      distinct: true,
    });

    return { count, articles: rows };
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: { id },
    });

    return !!affectedRows;
  }
}

module.exports = ArticleService;
