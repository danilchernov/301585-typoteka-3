DROP TABLE IF EXISTS categories CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS articles CASCADE;

DROP TABLE IF EXISTS comments CASCADE;

DROP TABLE IF EXISTS articles_categories CASCADE;

CREATE TABLE categories (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR(250) NOT NULL,
  lastname VARCHAR(250) NOT NULL,
  email VARCHAR(250) UNIQUE NOT NULL,
  password_hash VARCHAR(250) NOT NULL,
  avatar VARCHAR(50) NOT NULL
);

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(250) NOT NULL,
  announce VARCHAR(250) NOT NULL,
  full_text VARCHAR(1000) NOT NULL,
  image VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX ON articles(user_id);

CREATE INDEX ON articles(title);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE INDEX ON comments(article_id);

CREATE INDEX ON comments(user_id);

CREATE TABLE articles_categories(
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX ON articles_categories(article_id);

CREATE INDEX ON articles_categories(category_id);
