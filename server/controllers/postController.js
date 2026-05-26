const pool = require('../config/db');

const postQuery = (extra = '', params = []) => `
  SELECT p.*, u.username, u.avatar,
    COUNT(DISTINCT l.id)::int AS likes_count,
    COUNT(DISTINCT c.id)::int AS comments_count
    ${params.length > 0 && extra.includes('user_id') ? ', COUNT(DISTINCT sp.id)::int > 0 AS is_saved, COUNT(DISTINCT lk2.id)::int > 0 AS is_liked' : ''}
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN likes l ON l.post_id = p.id
  LEFT JOIN comments c ON c.post_id = p.id
  ${extra}
  GROUP BY p.id, u.username, u.avatar
  ORDER BY p.created_at DESC
`;

exports.getAll = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const vals = [];
    if (search) { vals.push(`%${search}%`); where += ` AND (p.title ILIKE $${vals.length} OR p.description ILIKE $${vals.length})`; }
    if (category) { vals.push(category); where += ` AND p.category=$${vals.length}`; }
    vals.push(limit, offset);
    const q = `SELECT p.*, u.username, u.avatar,
      COUNT(DISTINCT l.id)::int AS likes_count,
      COUNT(DISTINCT c.id)::int AS comments_count
      FROM posts p JOIN users u ON p.user_id=u.id
      LEFT JOIN likes l ON l.post_id=p.id
      LEFT JOIN comments c ON c.post_id=p.id
      ${where} GROUP BY p.id,u.username,u.avatar ORDER BY p.created_at DESC
      LIMIT $${vals.length - 1} OFFSET $${vals.length}`;
    const { rows } = await pool.query(q, vals);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const uid = req.user?.id;
    const { rows } = await pool.query(`
      SELECT p.*, u.username, u.avatar,
        COUNT(DISTINCT l.id)::int AS likes_count,
        COUNT(DISTINCT c.id)::int AS comments_count,
        ${uid ? `bool_or(l2.user_id=$2) AS is_liked, bool_or(sp.user_id=$2) AS is_saved` : 'false AS is_liked, false AS is_saved'}
      FROM posts p JOIN users u ON p.user_id=u.id
      LEFT JOIN likes l ON l.post_id=p.id
      ${uid ? `LEFT JOIN likes l2 ON l2.post_id=p.id AND l2.user_id=$2` : ''}
      ${uid ? `LEFT JOIN saved_posts sp ON sp.post_id=p.id AND sp.user_id=$2` : ''}
      LEFT JOIN comments c ON c.post_id=p.id
      WHERE p.id=$1 GROUP BY p.id,u.username,u.avatar`,
      uid ? [req.params.id, uid] : [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Post not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    const image_url = `/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      'INSERT INTO posts (user_id,title,description,image_url,category) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [req.user.id, title, description, image_url, category || 'General']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const { rows } = await pool.query('SELECT * FROM posts WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const updated = await pool.query(
      'UPDATE posts SET title=$1,description=$2,category=$3 WHERE id=$4 RETURNING *',
      [title || rows[0].title, description ?? rows[0].description, category || rows[0].category, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT user_id FROM posts WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await pool.query('DELETE FROM posts WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.like = async (req, res, next) => {
  try {
    const exists = await pool.query('SELECT id FROM likes WHERE post_id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (exists.rows.length) {
      await pool.query('DELETE FROM likes WHERE post_id=$1 AND user_id=$2', [req.params.id, req.user.id]);
      return res.json({ liked: false });
    }
    await pool.query('INSERT INTO likes (post_id,user_id) VALUES($1,$2)', [req.params.id, req.user.id]);
    res.json({ liked: true });
  } catch (err) { next(err); }
};

exports.save = async (req, res, next) => {
  try {
    const exists = await pool.query('SELECT id FROM saved_posts WHERE post_id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (exists.rows.length) {
      await pool.query('DELETE FROM saved_posts WHERE post_id=$1 AND user_id=$2', [req.params.id, req.user.id]);
      return res.json({ saved: false });
    }
    await pool.query('INSERT INTO saved_posts (post_id,user_id) VALUES($1,$2)', [req.params.id, req.user.id]);
    res.json({ saved: true });
  } catch (err) { next(err); }
};

exports.getSaved = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.username, u.avatar, COUNT(DISTINCT l.id)::int AS likes_count
      FROM saved_posts sp JOIN posts p ON sp.post_id=p.id
      JOIN users u ON p.user_id=u.id
      LEFT JOIN likes l ON l.post_id=p.id
      WHERE sp.user_id=$1 GROUP BY p.id,u.username,u.avatar ORDER BY sp.id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};