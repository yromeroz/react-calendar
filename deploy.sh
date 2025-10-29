#!/bin/bash

# Directory where Next.js is installed
APP_DIR="./"

# Production build directory
BUILD_DIR="$APP_DIR/.next"

# Logs directory
LOG_DIR="/var/log/my-app/"

# Check if the logs directory exists, create it if not
if [ ! -d "$LOG_DIR" ]; then
  mkdir -p "$LOG_DIR"
fi

# Start script for production
start() {
  echo "Starting $0..."
  nohup "$APP_DIR/node_modules/next/bin/next" start --port 3000 > "$LOG_DIR/$0.log" 2>&1 &
  echo "App started. Check logs at $LOG_DIR/$0.log"
}

# Stop script for production
stop() {
  echo "Stopping $0..."
  pkill -f "node_modules/next/bin/next start --port 3000"
  echo "App stopped."
}

# Handle command-line arguments
case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  *)
    echo "Usage: $0 {start|stop}"
    exit 1
    ;;
esac
