"use strict";

const { HTTP_CODE } = require(`../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const { commentId } = req.params;
  const { article } = res.locals;
  const comment = await service.findOne(commentId, article);

  if (!comment) {
    return res
      .status(HTTP_CODE.NOT_FOUND)
      .send(`Comment with id "${commentId}" not found`);
  }

  res.locals.comment = comment;
  return next();
};
