import re
import logging
import time
from email.utils import parseaddr
from scanner.utils import extract_urls_from_text, normalize_domain
from config import Config

logger = logging.getLogger(__name__)

class EmailScanner:
    """Email scanner that analyzes email content for phishing indicators"""
    
    def __init__(self, url_scanner):
        self.config = Config()
        self.url_scanner = url_scanner
        
    def scan_email(self, subject, sender, body, urls=None, attachments=None):
        """
        Scan an email for phishing threats
        
        Args:
            subject (str): Email subject line
            sender (str): Email sender address
            body (str): Email body text
            urls (list): List of URLs found in email (optional)
            attachments (list): List of attachment filenames (optional)
            
        Returns:
            dict: Scan results with phishing verdict
        """
        logger.info(f"Starting email scan from: {sender}")
        
        # Initialize result structure
        result = {
            "sender": sender,
            "subject": subject,
            "is_phishing": False,
            "risk_level": "low",
            "score": 0,
            "details": {
                "sender_analysis": {"suspicious_patterns": [], "domain_info": {}},
                "subject_analysis": {"phishing_keywords": [], "urgency_indicators": []},
                "body_analysis": {"phishing_keywords": [], "suspicious_patterns": []},
                "url_analysis": {"total_urls": 0, "suspicious_urls": 0, "url_results": []},
                "attachment_analysis": {"total_attachments": 0, "suspicious_attachments": []}
            },
            "timestamp": time.time()
        }
        
        # Analyze different components
        self._analyze_sender(sender, result)
        self._analyze_subject(subject, result)
        self._analyze_body(body, result)
        
        # Extract URLs from body if not provided
        if urls is None:
            urls = extract_urls_from_text(body)
        
        # Analyze URLs
        self._analyze_urls(urls, result)
        
        # Analyze attachments
        if attachments:
            self._analyze_attachments(attachments, result)
        
        # Calculate final verdict
        self._calculate_final_verdict(result)
        
        return result
    
    def _analyze_sender(self, sender, result):
        """Analyze sender email address for suspicious patterns"""
        try:
            # Parse sender address
            name, email_addr = parseaddr(sender)
            
            if not email_addr:
                result["details"]["sender_analysis"]["suspicious_patterns"].append("Invalid sender address")
                result["score"] += 2
                return
            
            # Check for suspicious sender patterns
            suspicious_patterns = []
            
            # Check against known suspicious patterns
            for pattern in self.config.SUSPICIOUS_SENDER_PATTERNS:
                if pattern in email_addr.lower():
                    suspicious_patterns.append(f"Suspicious pattern: {pattern}")
                    result["score"] += 1
            
            # Check for domain spoofing indicators
            domain = email_addr.split('@')[1].lower() if '@' in email_addr else ''
            
            # Check for suspicious TLDs
            for tld in self.config.SUSPICIOUS_TLDS:
                if domain.endswith(tld):
                    suspicious_patterns.append(f"Suspicious TLD: {tld}")
                    result["score"] += 2
            
            # Check for lookalike domains (basic check)
            legitimate_domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'amazon.com', 'paypal.com', 'microsoft.com', 'google.com', 'apple.com']
            for legit_domain in legitimate_domains:
                if domain != legit_domain and self._is_similar_domain(domain, legit_domain):
                    suspicious_patterns.append(f"Possible domain spoofing: {domain} (similar to {legit_domain})")
                    result["score"] += 3
            
            # Check for excessive subdomains
            if len(domain.split('.')) > 3:
                suspicious_patterns.append("Excessive subdomains in sender domain")
                result["score"] += 1
            
            result["details"]["sender_analysis"]["suspicious_patterns"] = suspicious_patterns
            result["details"]["sender_analysis"]["domain_info"] = {
                "domain": domain,
                "normalized": normalize_domain(domain)
            }
            
        except Exception as e:
            logger.error(f"Error in sender analysis: {str(e)}")
            result["details"]["sender_analysis"]["suspicious_patterns"].append("Error analyzing sender")
    
    def _analyze_subject(self, subject, result):
        """Analyze email subject for phishing keywords and patterns"""
        try:
            subject_lower = subject.lower()
            phishing_keywords = []
            urgency_indicators = []
            
            # Check for phishing keywords
            for keyword in self.config.PHISHING_KEYWORDS:
                if keyword in subject_lower:
                    phishing_keywords.append(keyword)
                    result["score"] += 1
            
            # Check for urgency indicators
            urgency_words = ['urgent', 'immediate', 'expires', 'deadline', 'act now', 'hurry', 'time sensitive']
            for word in urgency_words:
                if word in subject_lower:
                    urgency_indicators.append(word)
                    result["score"] += 1
            
            # Check for excessive punctuation/capitalization
            if len(re.findall(r'[!]{2,}', subject)) > 0:
                urgency_indicators.append("Excessive exclamation marks")
                result["score"] += 1
            
            if len(re.findall(r'[A-Z]{3,}', subject)) > 0:
                urgency_indicators.append("Excessive capitalization")
                result["score"] += 1
            
            result["details"]["subject_analysis"]["phishing_keywords"] = phishing_keywords
            result["details"]["subject_analysis"]["urgency_indicators"] = urgency_indicators
            
        except Exception as e:
            logger.error(f"Error in subject analysis: {str(e)}")
    
    def _analyze_body(self, body, result):
        """Analyze email body for phishing indicators"""
        try:
            body_lower = body.lower()
            phishing_keywords = []
            suspicious_patterns = []
            
            # Check for phishing keywords
            for keyword in self.config.PHISHING_KEYWORDS:
                if keyword in body_lower:
                    phishing_keywords.append(keyword)
                    result["score"] += 1
            
            # Check for suspicious patterns
            
            # Generic greeting (sign of mass phishing)
            generic_greetings = ['dear customer', 'dear user', 'dear member', 'dear sir/madam']
            for greeting in generic_greetings:
                if greeting in body_lower:
                    suspicious_patterns.append(f"Generic greeting: {greeting}")
                    result["score"] += 1
                    break
            
            # Check for credential harvesting indicators
            credential_patterns = [
                r'enter.{0,10}password',
                r'confirm.{0,10}password',
                r'verify.{0,10}identity',
                r'update.{0,10}payment',
                r'click.{0,10}here',
                r'download.{0,10}attachment'
            ]
            
            for pattern in credential_patterns:
                if re.search(pattern, body_lower):
                    suspicious_patterns.append(f"Credential harvesting pattern: {pattern}")
                    result["score"] += 2
            
            # Check for social engineering indicators
            social_engineering = [
                'limited time offer',
                'act immediately',
                'your account will be closed',
                'suspended account',
                'unauthorized access',
                'security breach',
                'verify now or lose access'
            ]
            
            for indicator in social_engineering:
                if indicator in body_lower:
                    suspicious_patterns.append(f"Social engineering: {indicator}")
                    result["score"] += 2
            
            # Check for poor grammar/spelling (basic check)
            common_mistakes = [
                'recieve',  # receive
                'seperate',  # separate
                'definately',  # definitely
                'occured',  # occurred
                'begining',  # beginning
            ]
            
            for mistake in common_mistakes:
                if mistake in body_lower:
                    suspicious_patterns.append(f"Spelling error: {mistake}")
                    result["score"] += 1
                    break
            
            result["details"]["body_analysis"]["phishing_keywords"] = phishing_keywords
            result["details"]["body_analysis"]["suspicious_patterns"] = suspicious_patterns
            
        except Exception as e:
            logger.error(f"Error in body analysis: {str(e)}")
    
    def _analyze_urls(self, urls, result):
        """Analyze URLs found in the email"""
        try:
            result["details"]["url_analysis"]["total_urls"] = len(urls)
            
            if not urls:
                return
            
            url_results = []
            suspicious_count = 0
            
            for url in urls:
                # Scan each URL using the URL scanner
                url_scan_result = self.url_scanner.scan_url(url)
                
                # Summarize URL result
                url_summary = {
                    "url": url,
                    "is_phishing": url_scan_result.get("is_phishing", False),
                    "risk_level": url_scan_result.get("risk_level", "low"),
                    "score": url_scan_result.get("score", 0)
                }
                
                url_results.append(url_summary)
                
                # Add to overall score
                result["score"] += url_scan_result.get("score", 0)
                
                # Count suspicious URLs
                if url_scan_result.get("is_phishing", False) or url_scan_result.get("risk_level", "low") in ["high", "critical"]:
                    suspicious_count += 1
            
            result["details"]["url_analysis"]["suspicious_urls"] = suspicious_count
            result["details"]["url_analysis"]["url_results"] = url_results
            
        except Exception as e:
            logger.error(f"Error in URL analysis: {str(e)}")
    
    def _analyze_attachments(self, attachments, result):
        """Analyze email attachments for suspicious indicators"""
        try:
            result["details"]["attachment_analysis"]["total_attachments"] = len(attachments)
            
            if not attachments:
                return
            
            suspicious_attachments = []
            
            # Suspicious file extensions
            suspicious_extensions = [
                '.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js',
                '.jar', '.zip', '.rar', '.7z', '.docm', '.xlsm', '.pptm'
            ]
            
            for attachment in attachments:
                attachment_lower = attachment.lower()
                
                # Check for suspicious extensions
                for ext in suspicious_extensions:
                    if attachment_lower.endswith(ext):
                        suspicious_attachments.append({
                            "filename": attachment,
                            "reason": f"Suspicious extension: {ext}"
                        })
                        result["score"] += 3
                        break
                
                # Check for double extensions (e.g., file.txt.exe)
                if len(re.findall(r'\.[a-z]{2,4}', attachment_lower)) > 1:
                    suspicious_attachments.append({
                        "filename": attachment,
                        "reason": "Double extension detected"
                    })
                    result["score"] += 2
                
                # Check for suspicious names
                suspicious_names = ['invoice', 'receipt', 'document', 'report', 'update', 'urgent']
                for name in suspicious_names:
                    if name in attachment_lower:
                        suspicious_attachments.append({
                            "filename": attachment,
                            "reason": f"Suspicious filename pattern: {name}"
                        })
                        result["score"] += 1
                        break
            
            result["details"]["attachment_analysis"]["suspicious_attachments"] = suspicious_attachments
            
        except Exception as e:
            logger.error(f"Error in attachment analysis: {str(e)}")
    
    def _is_similar_domain(self, domain1, domain2):
        """Check if two domains are similar (basic Levenshtein-like check)"""
        if abs(len(domain1) - len(domain2)) > 2:
            return False
        
        # Simple character substitution check
        differences = 0
        min_len = min(len(domain1), len(domain2))
        
        for i in range(min_len):
            if domain1[i] != domain2[i]:
                differences += 1
                if differences > 2:
                    return False
        
        return differences <= 2 and differences > 0
    
    def _calculate_final_verdict(self, result):
        """Calculate final phishing verdict based on accumulated score"""
        score = result["score"]
        
        if score >= self.config.PHISHING_SCORE_THRESHOLD:
            result["is_phishing"] = True
            result["risk_level"] = "critical"
        elif score >= self.config.HIGH_RISK_SCORE_THRESHOLD:
            result["risk_level"] = "high"
        elif score >= self.config.MEDIUM_RISK_SCORE_THRESHOLD:
            result["risk_level"] = "medium"
        else:
            result["risk_level"] = "low"
        
        logger.info(f"Email scan complete - Score: {score}, Risk: {result['risk_level']}, Phishing: {result['is_phishing']}")