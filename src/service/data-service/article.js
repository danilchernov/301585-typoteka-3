"use strict";

const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign(
      { id: nanoid(MAX_ID_LENGTH), comments: [] },
      article
    );

    this._articles.push(newArticle);

    return newArticle;
  }

  delete(id) {
    const article = this.findOne(id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);

    return article;
  }

  findOne(id) {
    return this._articles.find((article) => article.id === id);
  }

  findAll() {
    return this._articles;
  }

  update(id, article) {
    const oldArticle = this.findOne(id);

    return Object.assign(oldArticle, article);
  }
}

module.exports = ArticleService;
