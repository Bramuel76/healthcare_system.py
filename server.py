
#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import signal
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()
    
    def do_GET(self):
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Check if file exists
        file_path = self.path.lstrip('/')
        if not os.path.exists(file_path) and file_path != 'index.html':
            self.send_error(404, f"File not found: {file_path}")
            return
        
        super().do_GET()
    
    def log_message(self, format, *args):
        logger.info(f"{self.address_string()} - {format % args}")

def signal_handler(sig, frame):
    logger.info('Shutting down server...')
    sys.exit(0)

def main():
    PORT = 5000
    HOST = '0.0.0.0'
    
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Check if required files exist
        required_files = ['index.html', 'styles.css', 'script.js']
        missing_files = [f for f in required_files if not os.path.exists(f)]
        
        if missing_files:
            logger.error(f"Missing required files: {', '.join(missing_files)}")
            sys.exit(1)
        
        # Create server
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            logger.info(f"Server starting on http://{HOST}:{PORT}")
            logger.info(f"Serving directory: {os.getcwd()}")
            
            # Start server
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            logger.error(f"Port {PORT} is already in use. Please try a different port.")
        else:
            logger.error(f"Failed to start server: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
