from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import traceback
from scanner.url_scanner import URLScanner
from scanner.email_scanner import EmailScanner
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for browser extension

# Initialize scanners
url_scanner = URLScanner()
email_scanner = EmailScanner(url_scanner)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Phishing detection API is running"})

@app.route('/scan_url', methods=['POST'])
def scan_url():
    """
    Scan a URL for phishing threats
    Expected payload: {"url": "https://example.com"}
    """
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                "error": "Missing 'url' in request body",
                "is_phishing": False,
                "risk_level": "unknown"
            }), 400
        
        url = data['url']
        logger.info(f"Scanning URL: {url}")
        
        # Perform URL scanning
        result = url_scanner.scan_url(url)
        
        logger.info(f"URL scan result: {result}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error scanning URL: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Internal server error",
            "is_phishing": False,
            "risk_level": "unknown"
        }), 500

@app.route('/scan_email', methods=['POST'])
def scan_email():
    """
    Scan an email for phishing threats
    Expected payload: {
        "subject": "Email subject",
        "sender": "sender@example.com",
        "body": "Email body text",
        "urls": ["http://example.com"],  # optional
        "attachments": ["file.pdf"]      # optional
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "Missing request body",
                "is_phishing": False,
                "risk_level": "unknown"
            }), 400
        
        # Extract email components
        subject = data.get('subject', '')
        sender = data.get('sender', '')
        body = data.get('body', '')
        urls = data.get('urls', [])
        attachments = data.get('attachments', [])
        
        logger.info(f"Scanning email from: {sender}, subject: {subject[:50]}...")
        
        # Perform email scanning
        result = email_scanner.scan_email(
            subject=subject,
            sender=sender,
            body=body,
            urls=urls,
            attachments=attachments
        )
        
        logger.info(f"Email scan result: {result}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error scanning email: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Internal server error",
            "is_phishing": False,
            "risk_level": "unknown"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    logger.info("Starting Phishing Detection API...")
    app.run(debug=True, host='0.0.0.0', port=5000)