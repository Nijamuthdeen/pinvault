const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const exists = await pool.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username]);
    if (exists.rows.length) return res.status(409).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (username,email,password) VALUES($1,$2,$3) RETURNING id,username,email,avatar,bio,created_at',
      [username, email, hash]
    );
    res.status(201).json({ token: generateToken(rows[0]), user: rows[0] });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const { password: _, ...user } = rows[0];
    res.json({ token: generateToken(user), user });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,username,email,avatar,bio,created_at FROM users WHERE id=$1', [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};