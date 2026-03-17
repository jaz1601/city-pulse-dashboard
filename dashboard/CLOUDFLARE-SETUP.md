# Cloudflare Configuration Guide

## 🌐 Domain Setup: dashboard.citypulsesa.com

### Step 1: DNS Configuration

In your Cloudflare dashboard:

1. **Go to:** DNS > Records
2. **Add Record:**
   - **Type:** A
   - **Name:** dashboard
   - **IPv4 Address:** [YOUR_SERVER_IP]
   - **Proxy Status:** 🟢 Proxied (orange cloud)
   - **TTL:** Auto

### Step 2: SSL/TLS Settings

1. **Go to:** SSL/TLS > Overview
2. **Set to:** Full (strict)
3. **Enable:** Always Use HTTPS
4. **Enable:** Automatic HTTPS Rewrites

### Step 3: Security Settings

1. **Go to:** Security > Settings
2. **Security Level:** High
3. **Challenge Passage:** 30 minutes
4. **Enable:** Browser Integrity Check

### Step 4: Page Rules (Optional but Recommended)

Create these rules:

**Rule 1: Force HTTPS**
- URL: `http://dashboard.citypulsesa.com/*`
- Setting: Always Use HTTPS

**Rule 2: Security Headers**
- URL: `dashboard.citypulsesa.com/*`
- Settings:
  - Security Level: High
  - Browser Integrity Check: On

### Step 5: Access Policy (Zero Trust) - OPTIONAL EXTRA SECURITY

For additional security beyond the login:

1. **Go to:** Zero Trust > Access > Applications
2. **Add Application:**
   - Name: City Pulse Dashboard
   - Session Duration: 24 hours
   - Domain: dashboard.citypulsesa.com
3. **Add Policy:**
   - Name: Allow Yasmine
   - Action: Allow
   - Include: Email (marketing7101@gmail.com)

---

## 🚀 Deployment Steps

### On Your Server:

1. **Upload files:**
   ```bash
   # Clone from GitHub
   git clone https://github.com/jaz1601/city-pulse-dashboard.git
   cd city-pulse-dashboard/dashboard
   ```

2. **Install dependencies:**
   ```bash
   # If using PM2 for process management
   npm install -g pm2
   ```

3. **Start the server:**
   ```bash
   sudo ./start-production.sh
   ```

4. **Verify it's running:**
   ```bash
   curl http://localhost
   # Should return login page
   ```

---

## 🔒 Security Features Enabled

✅ **Password Authentication**
- Username: jazdigitalhaven
- Password: Ateeqah@020925
- SHA-256 password hashing
- Secure session cookies

✅ **Session Management**
- 24-hour session timeout
- HttpOnly cookies
- Secure flag (HTTPS only)
- SameSite protection

✅ **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Strict-Transport-Security
- Referrer-Policy

✅ **Cloudflare Protection**
- DDoS protection
- WAF (Web Application Firewall)
- Bot management
- SSL/TLS encryption

---

## 📝 Access Information

**URL:** https://dashboard.citypulsesa.com

**Login Credentials:**
- Username: jazdigitalhaven
- Password: Ateeqah@020925

**Session:** 24 hours

---

## 🛠️ Troubleshooting

### Can't Access?
1. Check DNS is propagated: `dig dashboard.citypulsesa.com`
2. Verify server is running: `sudo netstat -tlnp | grep :80`
3. Check firewall: `sudo ufw status`

### SSL Issues?
1. Ensure Cloudflare SSL mode is "Full (strict)"
2. Check certificate is valid
3. Clear browser cache

### Forgot Password?
Edit `server-secure.js` and update the `passwordHash` value:
```javascript
// Generate new hash
const crypto = require('crypto');
const newHash = crypto.createHash('sha256').update('newpassword').digest('hex');
console.log(newHash);
```

---

## 🔄 Auto-Start on Boot

### Using systemd:

Create `/etc/systemd/system/city-pulse-dashboard.service`:

```ini
[Unit]
Description=City Pulse Dashboard
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/dashboard
ExecStart=/usr/bin/node server-secure.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable city-pulse-dashboard
sudo systemctl start city-pulse-dashboard
```

---

## 📊 Monitoring

### Check Status:
```bash
# Process status
ps aux | grep node

# Port listening
sudo netstat -tlnp | grep :80

# Logs
tail -f /var/log/syslog | grep node
```

---

*Configuration created: March 17, 2026*
*Domain: dashboard.citypulsesa.com*