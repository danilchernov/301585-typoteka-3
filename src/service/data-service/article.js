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

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: { id },
    });

    return !!affectedRows;
  }

  async findOne(id, { comments } = {}) {
    const include = [
      Alias.CATEGORIES,
      ...(comments
        ? [
            {
              model: this._Comment,
              as: Alias.COMMENTS,
              include: [Alias.USERS],
            },
          ]
        : []),
    ];

    const order = [
      ...(comments
        ? [[{ model: this._Comment, as: Alias.COMMENTS }, `createdAt`, `DESC`]]
        : []),
    ];

    return this._Article.findByPk(id, { include, order });
  }

  async findAll({ comments } = {}) {
    const include = [Alias.CATEGORIES, ...(comments ? [Alias.COMMENTS] : [])];

    const articles = await this._Article.findAll({
      include,
      order: [[`date`, `DESC`]],
    });

    return articles.map((item) => item.get());
  }

  async findPage({ comments, limit, offset } = {}) {
    const include = [Alias.CATEGORIES, ...(comments ? [Alias.COMMENTS] : [])];

    const { count, rows } = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [[`date`, `DESC`]],
      distinct: true,
    });

    return { count, articles: rows };
  }
}

module.exports = ArticleService;
