const pool = require('../config/db');

exports.getProfile = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,username,email,avatar,bio,created_at FROM users WHERE username=$1',
      [req.params.username]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const posts = await pool.query(
      `SELECT p.*, COUNT(DISTINCT l.id)::int AS likes_count FROM posts p
       LEFT JOIN likes l ON l.post_id=p.id WHERE p.user_id=$1
       GROUP BY p.id ORDER BY p.created_at DESC`,
      [rows[0].id]
    );
    res.json({ ...rows[0], posts: posts.rows });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { bio } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const fields = [];
    const vals = [];
    if (bio !== undefined) { vals.push(bio); fields.push(`bio=$${vals.length}`); }
    if (avatar) { vals.push(avatar); fields.push(`avatar=$${vals.length}`); }
    if (!fields.length) return res.status(400).json({ message: 'Nothing to update' });
    vals.push(req.user.id);
    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(',')} WHERE id=$${vals.length} RETURNING id,username,email,avatar,bio`,
      vals
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
};