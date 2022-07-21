'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const MAX_ARTICLE_ANNOUNCE_LENGTH = 100;
  const MAX_COMMENT_TEXT_LENGTH = 100;

  const socket = io(SERVER_URL);

  const popularArticlesList = document.querySelector(`.hot__list`);
  const lastCommentsList = document.querySelector(`.last__list`);

  const createArticlesElement = (article) => {
    const articleCardTemplate = document.getElementById('popular-article-template');
    const articleCardElement = articleCardTemplate.cloneNode(true).content;

    articleCardElement.querySelector('.hot__list-link').href = `/articles/${article.id}`
    articleCardElement.querySelector('.hot__list-link').innerHTML = `
      ${article.announce > MAX_ARTICLE_ANNOUNCE_LENGTH? `${article.announce.substring(0, MAX_ARTICLE_ANNOUNCE_LENGTH)}...`: article.announce}
      <sup class="hot__link-sup">${article.count}</sup>
    `;

    return articleCardElement;
  }

  const createCommentElement = (comment) => {
    const commentCardTemplate = document.getElementById('last-comment-template');
    const commentCardElement = commentCardTemplate.cloneNode(true).content;

    commentCardElement.querySelector('.last__list-image').src = `/img/${comment.users.avatar}`
    commentCardElement.querySelector('.last__list-name').innerHTML = `${comment.users.firstName} ${comment.users.lastName}`;
    commentCardElement.querySelector('.last__list-link').href = `/articles/${comment.articleId}`;
    commentCardElement.querySelector('.last__list-link').innerHTML = comment.text.length > MAX_COMMENT_TEXT_LENGTH ? `${comment.text.substring(0, MAX_ARTICLE_ANNOUNCE_LENGTH)}...}`: comment.text;

    return commentCardElement;
  }

  socket.addEventListener('popular-articles', (articles) => {
    popularArticlesList.innerHTML = ``;

    articles.forEach((article) => {
      popularArticlesList.appendChild(createArticlesElement(article));
    })
  })

  socket.addEventListener('last-comments', (comments) => {
    lastCommentsList.innerHTML = ``

    comments.forEach((comment) => {
      lastCommentsList.appendChild(createCommentElement(comment));
    })

  })
})();
