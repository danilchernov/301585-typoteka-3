"use strict";

const axios = require(`axios`);
const { HttpMethod } = require(`../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({ url, ...options });
    return response.data;
  }

  async getArticles({ comments, limit, offset } = {}) {
    return await this._load(`/articles`, {
      params: { comments, limit, offset },
    });
  }

  async getArticle(id, { comments } = {}) {
    return await this._load(`/articles/${id}`, { params: { comments } });
  }

  async search(query) {
    return await this._load(`/search`, { params: { query } });
  }

  async getCategories({ count } = {}) {
    return await this._load(`/categories`, { params: { count } });
  }

  async createArticle(data, accessToken) {
    return await this._load(`/articles`, {
      method: HttpMethod.POST,
      headers: {
        authorization: accessToken,
      },
      data,
    });
  }

  async updateArticle(id, data, accessToken) {
    return await this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      headers: {
        authorization: accessToken,
      },
      data,
    });
  }

  async deleteArticle(id, accessToken) {
    return await this._load(`/articles/${id}`, {
      method: `DELETE`,
      headers: {
        authorization: accessToken,
      },
    });
  }

  async createComment(id, data, accessToken) {
    return await this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      headers: {
        authorization: accessToken,
      },
      data,
    });
  }

  async deleteComment(id, articleId, accessToken) {
    return await this._load(`/articles/${articleId}/comments/${id}`, {
      method: `DELETE`,
      headers: {
        authorization: accessToken,
      },
    });
  }

  async createUser(data) {
    return await this._load(`/user`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async loginUser(data) {
    return await this._load(`/user/login`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async getAllComments() {
    return await this._load(`/comments`, {
      method: HttpMethod.GET,
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = { API, getApi: () => defaultAPI };
