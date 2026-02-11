import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { verifyGoogleToken } from '../utils/google.js';
import { 
    successResponse, 
    errorResponse, 
    conflictResponse, 
    unauthorizedResponse 
} from '../utils/response.js';

const { User } = models;

// Signup...
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return conflictResponse(res, 'Email already exists', { email });
        }

        const hashed = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashed,
            role,
        });

        const token = generateToken(user);
        
        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            created_at: user.created_at
        };

        return successResponse(res, 'User registered successfully', { token, user: userResponse }, 201);

    } catch (err) {
        console.error('Signup error:', err);
        return errorResponse(res, 'Registration failed', 'SIGNUP_ERROR');
    }
};

// Login...
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !user.password) {
            return unauthorizedResponse(res, 'Invalid email or password');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return unauthorizedResponse(res, 'Invalid email or password');
        }

        const token = generateToken(user);
        
        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            created_at: user.created_at
        };

        return successResponse(res, 'Login successful', { token, user: userResponse });

    } catch (err) {
        console.error('Login error:', err);
        return errorResponse(res, 'Login failed', 'LOGIN_ERROR');
    }
};

// Google auth...
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const payload = await verifyGoogleToken(token);

        let user = await User.findOne({ where: { email: payload.email.toLowerCase() } });

        if (!user) {
            user = await User.create({
                name: payload.name,
                email: payload.email.toLowerCase(),
                provider: 'GOOGLE',
                provider_id: payload.sub,
                role: 'RESTAURANT_ADMIN',
            });
        }

        const jwtToken = generateToken(user);
        
        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            created_at: user.created_at
        };

        return successResponse(res, 'Google authentication successful', { token: jwtToken, user: userResponse });

    } catch (err) {
        console.error('Google auth error:', err);
        return unauthorizedResponse(res, 'Google authentication failed');
    }
};
