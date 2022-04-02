"use strict";

const path = require(`path`);
const express = require(`express`);

const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);
app.locals.basedir = app.get(`views`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);

app.listen(DEFAULT_PORT);
