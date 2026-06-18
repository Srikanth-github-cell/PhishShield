import os

class Config:
    """Configuration class for API keys and constants"""
    
    # API Keys - Replace with your actual keys
    GOOGLE_SAFE_BROWSING_API_KEY = os.environ.get('GOOGLE_SAFE_BROWSING_API_KEY') or "AIzaSyAVzu3agO0kPfqHcvXsDHhliJx5XbcUaxo"
    VIRUSTOTAL_API_KEY = os.environ.get('VIRUSTOTAL_API_KEY') or "c1f41fb6c09ef95c95601ece8192021afb48b8e1271f822887664a1e311e1355"
    URLHAUS_API_KEY = os.environ.get('URLHAUS_API_KEY') or "e295bd97ecd0babd1dd4955884688b98c9f98ec39bb54807"

    # API Endpoints
    GOOGLE_SAFE_BROWSING_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find"
    URLHAUS_API_URL = "https://urlhaus-api.abuse.ch/v1/url/"
    VIRUSTOTAL_URL_SCAN_URL = "https://www.virustotal.com/vtapi/v2/url/report"
    
    # Phishing keywords for email analysis
    PHISHING_KEYWORDS = [
        # Urgency indicators
        'urgent', 'immediate', 'action required', 'expires today', 'limited time',
        'act now', 'don\'t delay', 'hurry', 'time sensitive', 'deadline',
        
        # Security/account related
        'verify account', 'confirm identity', 'update payment', 'suspended account',
        'unauthorized access', 'security alert', 'login attempt', 'verify now',
        'click here to verify', 'account locked', 'reactivate', 'validate',
        
        # Financial/payment
        'refund', 'payment failed', 'billing issue', 'invoice', 'transaction',
        'credit card', 'bank account', 'paypal', 'prize', 'winner', 'claim now',
        'tax refund', 'stimulus', 'reward',
        
        # Generic phishing
        'reset password', 'update information', 'confirm details', 'click link',
        'download attachment', 'install now', 'free', 'congratulations',
        'you\'ve won', 'claim your', 'limited offer'
    ]
    
    # Suspicious sender patterns
    SUSPICIOUS_SENDER_PATTERNS = [
        'noreply@',
        'no-reply@',
        'support@',
        'security@',
        'admin@',
        'service@',
        'notification@',
        'alert@'
    ]
    
    # Suspicious TLDs
    SUSPICIOUS_TLDS = [
        '.tk', '.ml', '.ga', '.cf', '.click', '.download', '.science',
        '.work', '.party', '.review', '.trade', '.win', '.bid', '.stream'
    ]
    
    # Risk levels
    RISK_LEVELS = {
        'low': 0,
        'medium': 1,
        'high': 2,
        'critical': 3
    }
    
    # Scoring thresholds
    PHISHING_SCORE_THRESHOLD = 5  # Score above this is considered phishing
    HIGH_RISK_SCORE_THRESHOLD = 3  # Score above this is high risk
    MEDIUM_RISK_SCORE_THRESHOLD = 1  # Score above this is medium risk