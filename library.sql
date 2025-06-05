DROP TABLE IF EXISTS library;
-- In case of existing tablem then drop
CREATE TABLE library (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  author VARCHAR(100),
  UNIQUE (title, author)
);
-- title and author must be a unique pair 