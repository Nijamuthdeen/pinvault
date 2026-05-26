const pool = require('../config/db');

exports.getByPost = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, u.username, u.avatar FROM comments c
       JOIN users u ON c.user_id=u.id WHERE c.post_id=$1 ORDER BY c.created_at ASC`,
      [req.params.postId]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Comment required' });
    const { rows } = await pool.query(
      'INSERT INTO comments (post_id,user_id,content) VALUES($1,$2,$3) RETURNING *',
      [req.params.postId, req.user.id, content.trim()]
    );
    const withUser = await pool.query(
      'SELECT c.*,u.username,u.avatar FROM comments c JOIN users u ON c.user_id=u.id WHERE c.id=$1',
      [rows[0].id]
    );
    res.status(201).json(withUser.rows[0]);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT user_id FROM comments WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await pool.query('DELETE FROM comments WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};