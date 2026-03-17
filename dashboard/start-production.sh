#!/bin/bash

# City Pulse Dashboard - Production Startup Script
# Run this to start the secure dashboard server

echo "🏙️ Starting City Pulse Dashboard..."
echo "=================================="

# Check if running as root (needed for ports 80/443)
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Please run as root (use sudo)"
    echo "   sudo ./start-production.sh"
    exit 1
fi

# Kill any existing node processes on port 80
echo "🧹 Cleaning up existing processes..."
pkill -f "node server-secure.js" 2>/dev/null
sleep 2

# Start the server
echo "🚀 Starting secure server..."
echo "   Domain: dashboard.citypulsesa.com"
echo "   Port: 80"
echo "   Auth: Required"
echo ""

node server-secure.js &

# Save PID
echo $! > /tmp/city-pulse-dashboard.pid

echo "✅ Dashboard started!"
echo ""
echo "📊 Status:"
echo "   PID: $(cat /tmp/city-pulse-dashboard.pid)"
echo "   URL: http://dashboard.citypulsesa.com"
echo "   Login: jazdigitalhaven"
echo ""
echo "🛑 To stop: sudo pkill -f 'node server-secure.js'"
echo "📋 Logs: tail -f /var/log/city-pulse-dashboard.log"