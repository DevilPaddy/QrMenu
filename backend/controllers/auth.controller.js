import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { verifyGoogleToken } from '../utils/google.js';

const { User } = models;

// Signup..
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = generateToken(user);
    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login...
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Google auth...
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = await verifyGoogleToken(token);

    let user = await User.findOne({ where: { email: payload.email } });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        provider: 'GOOGLE',
        provider_id: payload.sub,
        role: 'RESTAURANT_ADMIN',
      });
    }

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken, user });

  } catch (err) {
    res.status(401).json({ error: 'Google authentication failed' });
  }
};
