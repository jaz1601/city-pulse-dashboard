const crypto = require('crypto');

// Configuration
const USERNAME = process.env.USERNAME || 'jazdigitalhaven';
const PASSWORD_HASH = process.env.PASSWORD_HASH || '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

// Hash function
function hashString(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

// Parse cookies
function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookies[name] = value;
        });
    }
    return cookies;
}

// Check authentication
function isAuthenticated(req) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.sessionId;
    return sessionId === 'authenticated';
}

// Login handler
module.exports = (req, res) => {
    // Set CORS and security headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { username, password } = req.body;

    if (username === USERNAME && hashString(password) === PASSWORD_HASH) {
        res.setHeader('Set-Cookie', 'sessionId=authenticated; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/');
        res.status(200).json({ success: true, redirect: '/' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};