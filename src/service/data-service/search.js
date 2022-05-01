"use strict";

const { Op } = require(`sequelize`);
const Alias = require(`../models/alias`);

class SearchService {
  constructor(sequeilze) {
    this._Article = sequeilze.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText,
        },
      },
      include: [Alias.CATEGORIES],
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
