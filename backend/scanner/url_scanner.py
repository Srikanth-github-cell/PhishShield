import requests
import logging
import time
from urllib.parse import urlparse
from config import Config

logger = logging.getLogger(__name__)

class URLScanner:
    """URL scanner that uses multiple free-tier APIs to detect phishing URLs"""
    
    def __init__(self):
        self.config = Config()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'PhishingDetector/1.0'
        })
    
    def scan_url(self, url):
        """
        Scan a URL using multiple services and return aggregated results
        
        Args:
            url (str): URL to scan
            
        Returns:
            dict: Scan results with phishing verdict
        """
        logger.info(f"Starting URL scan for: {url}")
        
        # Initialize result structure
        result = {
            "url": url,
            "is_phishing": False,
            "risk_level": "low",
            "score": 0,
            "details": {
                "google_safe_browsing": {"status": "unknown", "threats": []},
                "urlhaus": {"status": "unknown", "malware": False},
                "virustotal": {"status": "unknown", "positives": 0, "total": 0},
                "url_analysis": {"suspicious_patterns": []}
            },
            "timestamp": time.time()
        }
        
        # Perform basic URL analysis
        self._analyze_url_patterns(url, result)
        
        # Scan with external services
        self._scan_google_safe_browsing(url, result)
        self._scan_urlhaus(url, result)
        self._scan_virustotal(url, result)
        
        # Calculate final verdict
        self._calculate_final_verdict(result)
        
        return result
    
    def _analyze_url_patterns(self, url, result):
        """Analyze URL for suspicious patterns"""
        try:
            parsed = urlparse(url)
            suspicious_patterns = []
            
            # Check for suspicious TLD
            domain = parsed.netloc.lower()
            for tld in self.config.SUSPICIOUS_TLDS:
                if domain.endswith(tld):
                    suspicious_patterns.append(f"Suspicious TLD: {tld}")
                    result["score"] += 2
            
            # Check for IP address instead of domain
            if parsed.netloc.replace('.', '').replace(':', '').isdigit():
                suspicious_patterns.append("IP address used instead of domain")
                result["score"] += 3
            
            # Check for excessive subdomains
            if len(domain.split('.')) > 4:
                suspicious_patterns.append("Excessive subdomains")
                result["score"] += 1
            
            # Check for URL shorteners (common in phishing)
            shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly']
            if any(shortener in domain for shortener in shorteners):
                suspicious_patterns.append("URL shortener detected")
                result["score"] += 1
            
            # Check for suspicious keywords in URL
            suspicious_keywords = ['secure', 'account', 'verify', 'login', 'update', 'confirm']
            for keyword in suspicious_keywords:
                if keyword in url.lower():
                    suspicious_patterns.append(f"Suspicious keyword: {keyword}")
                    result["score"] += 1
                    break
            
            result["details"]["url_analysis"]["suspicious_patterns"] = suspicious_patterns
            
        except Exception as e:
            logger.error(f"Error in URL pattern analysis: {str(e)}")
    
    def _scan_google_safe_browsing(self, url, result):
        """Scan URL using Google Safe Browsing API"""
        try:
            if self.config.GOOGLE_SAFE_BROWSING_API_KEY == "YOUR_GOOGLE_SAFE_BROWSING_API_KEY":
                result["details"]["google_safe_browsing"]["status"] = "api_key_not_configured"
                return
            
            payload = {
                "client": {
                    "clientId": "phishing-detector",
                    "clientVersion": "1.0"
                },
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": url}]
                }
            }
            
            response = self.session.post(
                f"{self.config.GOOGLE_SAFE_BROWSING_URL}?key={self.config.GOOGLE_SAFE_BROWSING_API_KEY}",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "matches" in data:
                    threats = [match["threatType"] for match in data["matches"]]
                    result["details"]["google_safe_browsing"] = {
                        "status": "threat_found",
                        "threats": threats
                    }
                    result["score"] += 5  # High score for confirmed threats
                else:
                    result["details"]["google_safe_browsing"]["status"] = "clean"
            else:
                result["details"]["google_safe_browsing"]["status"] = f"error_{response.status_code}"
                
        except Exception as e:
            logger.error(f"Google Safe Browsing scan error: {str(e)}")
            result["details"]["google_safe_browsing"]["status"] = "error"
    def _scan_urlhaus(self, url, result):
        """Scan URL using URLhaus API and extract malware-related metadata"""
        try:
            payload = {"url": url}
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Auth-Key": self.config.URLHAUS_API_KEY  # Optional if your key is required
            }

            response = self.session.post(
                self.config.URLHAUS_API_URL,
                data=payload,
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                urlhaus_details = result["details"]["urlhaus"]

                if data.get("query_status") == "ok":
                    urlhaus_details["status"] = "malware_found"
                    urlhaus_details["malware"] = True
                    urlhaus_details["threat"] = data.get("threat", "unknown")
                    urlhaus_details["tags"] = data.get("tags", [])
                    urlhaus_details["url_status"] = data.get("url_status", "unknown")
                    urlhaus_details["reference"] = data.get("urlhaus_reference")
                    urlhaus_details["reporter"] = data.get("reporter", "unknown")
                    urlhaus_details["payloads"] = []

                    # Score for known malware
                    result["score"] += 5

                    for payload in data.get("payloads", []):
                        urlhaus_details["payloads"].append({
                            "filename": payload.get("filename"),
                            "file_type": payload.get("file_type"),
                            "sha256": payload.get("response_sha256"),
                            "virustotal": payload.get("virustotal", {}),
                            "signature": payload.get("signature"),
                            "urlhaus_download": payload.get("urlhaus_download")
                        })

                        # Extra score if VirusTotal confirms detection
                        vt = payload.get("virustotal", {})
                        if isinstance(vt, dict) and "result" in vt:
                            positives = int(vt["result"].split("/")[0].strip())
                            if positives > 0:
                                result["score"] += min(positives, 3)  # Cap per payload
                elif data.get("query_status") == "no_results":
                    urlhaus_details["status"] = "clean"
                else:
                    urlhaus_details["status"] = data.get("query_status", "unknown")
            else:
                result["details"]["urlhaus"]["status"] = f"error_{response.status_code}"
                result["details"]["urlhaus"]["response"] = response.text

        except Exception as e:
            logger.error(f"URLhaus scan error: {str(e)}")
            result["details"]["urlhaus"]["status"] = "error"

    
    def _scan_virustotal(self, url, result):
        """Scan URL using VirusTotal API"""
        try:
            if self.config.VIRUSTOTAL_API_KEY == "YOUR_VIRUSTOTAL_API_KEY":
                result["details"]["virustotal"]["status"] = "api_key_not_configured"
                return
            
            params = {
                "apikey": self.config.VIRUSTOTAL_API_KEY,
                "resource": url
            }
            
            response = self.session.get(
                self.config.VIRUSTOTAL_URL_SCAN_URL,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("response_code") == 1:
                    positives = data.get("positives", 0)
                    total = data.get("total", 0)
                    
                    result["details"]["virustotal"] = {
                        "status": "scanned",
                        "positives": positives,
                        "total": total,
                        "scan_date": data.get("scan_date", "")
                    }
                    
                    # Add score based on detection ratio
                    if positives > 0:
                        result["score"] += min(positives, 3)  # Cap at 3 points
                elif data.get("response_code") == 0:
                    result["details"]["virustotal"]["status"] = "not_found"
                else:
                    result["details"]["virustotal"]["status"] = "unknown"
            else:
                result["details"]["virustotal"]["status"] = f"error_{response.status_code}"
                
        except Exception as e:
            logger.error(f"VirusTotal scan error: {str(e)}")
            result["details"]["virustotal"]["status"] = "error"
    
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
        
        logger.info(f"URL scan complete - Score: {score}, Risk: {result['risk_level']}, Phishing: {result['is_phishing']}")

