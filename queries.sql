-- List of all categories
SELECT categories.id,
  categories.name
FROM categories;

-- List of non-empty categories
SELECT categories.id,
  categories.name
FROM categories
WHERE EXISTS (
    SELECT *
    FROM articles_categories
    WHERE articles_categories.category_id = categories.id
  );

-- Categories with number of articles
SELECT categories.id,
  categories.name,
  COUNT(articles_categories.article_id)
FROM categories
  LEFT JOIN articles_categories ON categories.id = category_id
GROUP BY(id);

-- List of articles, newest first
SELECT articles.id,
  articles.title,
  articles.announce,
  articles.created_at,
  users.firstname,
  users.lastname,
  users.email,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  COUNT(DISTINCT comments.id) AS comments_count
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON articles.id = comments.article_id
  JOIN users ON articles.user_id = users.id
GROUP BY articles.id,
  users.id
ORDER BY articles.created_at DESC;

-- Detailed information about the article
SELECT articles.id,
  articles.title,
  articles.announce,
  articles.created_at,
  users.firstname,
  users.lastname,
  users.email,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  COUNT(DISTINCT comments.id) AS comments_count
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON articles.id = comments.article_id
  JOIN users ON articles.user_id = users.id
WHERE articles.id = 1
GROUP BY articles.id,
  users.id;

-- Five recent comments
SELECT comments.id,
  comments.article_id,
  comments.text,
  users.firstname,
  users.lastname
FROM comments
  JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC
LIMIT 5;

-- Article comments
SELECT comments.id,
  comments.article_id,
  comments.text,
  users.firstname,
  users.lastname
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created_at DESC;

-- Update Title
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
