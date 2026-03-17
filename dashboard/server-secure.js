const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
    httpPort: 80,
    httpsPort: 443,
    domain: 'dashboard.citypulsesa.com',
    username: 'jazdigitalhaven',
    // Password hash for 'Ateeqah@020925'
    passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    allowedIps: [] // Add specific IPs here if needed
};

// Simple session store
const sessions = new Map();

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf'
};

// Hash function
function hashString(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

// Generate session ID
function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
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

// Check if user is authenticated
function isAuthenticated(req) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.sessionId;
    
    if (!sessionId || !sessions.has(sessionId)) {
        return false;
    }
    
    const session = sessions.get(sessionId);
    if (Date.now() - session.created > CONFIG.sessionTimeout) {
        sessions.delete(sessionId);
        return false;
    }
    
    return true;
}

// Serve login page
function serveLoginPage(res, error = '') {
    const loginHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>City Pulse Dashboard - Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #333;
            font-size: 1.8rem;
            margin-bottom: 5px;
        }
        .logo p {
            color: #666;
            font-size: 0.9rem;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .error {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>🏙️ City Pulse</h1>
            <p>Dashboard Login</p>
        </div>
        ${error ? `<div class="error">${error}</div>` : ''}
        <form method="POST" action="/login">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Sign In</button>
        </form>
        <div class="footer">
            <p>Private Access Only</p>
        </div>
    </div>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(loginHtml);
}

// Handle login
function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const username = params.get('username');
        const password = params.get('password');
        
        if (username === CONFIG.username && hashString(password) === CONFIG.passwordHash) {
            const sessionId = generateSessionId();
            sessions.set(sessionId, {
                username: username,
                created: Date.now()
            });
            
            res.writeHead(302, {
                'Location': '/',
                'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
            });
            res.end();
        } else {
            serveLoginPage(res, 'Invalid username or password');
        }
    });
}

// Handle logout
function handleLogout(req, res) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.sessionId;
    
    if (sessionId) {
        sessions.delete(sessionId);
    }
    
    res.writeHead(302, {
        'Location': '/login',
        'Set-Cookie': 'sessionId=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/' 
    });
    res.end();
}

// Main server handler
const server = http.createServer((req, res) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    const url = req.url;
    
    // Handle login
    if (url === '/login' && req.method === 'POST') {
        handleLogin(req, res);
        return;
    }
    
    // Handle logout
    if (url === '/logout') {
        handleLogout(req, res);
        return;
    }
    
    // Check authentication for all other routes
    if (!isAuthenticated(req) && url !== '/login') {
        serveLoginPage(res);
        return;
    }
    
    // Serve static files
    let filePath = '.' + url;
    if (filePath === './' || filePath === './login') {
        filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'private, no-cache, no-store, must-revalidate'
            });
            res.end(content, 'utf-8');
        }
    });
});

// Start server
server.listen(CONFIG.httpPort, () => {
    console.log(`🔒 Secure City Pulse Dashboard running at http://${CONFIG.domain}`);
    console.log(`🔐 Authentication required`);
    console.log(`👤 Username: ${CONFIG.username}`);
    console.log(`Press Ctrl+C to stop`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = { server, CONFIG };