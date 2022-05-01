"use strict";

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(comment, articleId) {
    return await this._Comment.create({
      articleId,
      ...comment,
    });
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {
        id,
      },
    });

    return !!deletedRows;
  }

  async findOne(id) {
    return await this._Comment.findByPk(id);
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: { articleId },
      raw: true,
    });
  }
}

module.exports = CommentService;
