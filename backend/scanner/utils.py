import re
import requests
import logging
from urllib.parse import urlparse
from typing import List, Optional, Dict, Any

logger = logging.getLogger(__name__)

def extract_urls_from_text(text: str) -> List[str]:
    """
    Extract URLs from plain text using regex
    
    Args:
        text (str): Text content to search for URLs
        
    Returns:
        List[str]: List of found URLs
    """
    if not text:
        return []
    
    try:
        # Comprehensive URL regex pattern
        url_pattern = r'https?://[^\s<>"\']+|www\.[^\s<>"\']+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[^\s<>"\']*)?'
        
        # Find all URLs
        urls = re.findall(url_pattern, text, re.IGNORECASE)
        
        # Clean and validate URLs
        cleaned_urls = []
        for url in urls:
            # Remove trailing punctuation
            url = re.sub(r'[.,;:!?)+}\]]+$', '', url)
            
            # Add protocol if missing
            if not url.startswith(('http://', 'https://')):
                if url.startswith('www.'):
                    url = 'https://' + url
                else:
                    # Only add protocol if it looks like a domain
                    if '.' in url and not url.startswith('mailto:'):
                        url = 'https://' + url
            
            # Validate URL format
            if _is_valid_url(url):
                cleaned_urls.append(url)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_urls = []
        for url in cleaned_urls:
            if url not in seen:
                seen.add(url)
                unique_urls.append(url)
        
        logger.debug(f"Extracted {len(unique_urls)} URLs from text")
        return unique_urls
        
    except Exception as e:
        logger.error(f"Error extracting URLs from text: {str(e)}")
        return []

def _is_valid_url(url: str) -> bool:
    """
    Validate if a string is a properly formatted URL
    
    Args:
        url (str): URL string to validate
        
    Returns:
        bool: True if URL is valid, False otherwise
    """
    try:
        parsed = urlparse(url)
        return all([
            parsed.scheme in ('http', 'https'),
            parsed.netloc,
            '.' in parsed.netloc,
            len(parsed.netloc) > 3
        ])
    except Exception:
        return False

def normalize_domain(domain: str) -> str:
    """
    Normalize domain name for consistent comparison
    
    Args:
        domain (str): Domain name to normalize
        
    Returns:
        str: Normalized domain name
    """
    if not domain:
        return ""
    
    try:
        # Convert to lowercase
        domain = domain.lower().strip()
        
        # Remove common prefixes
        prefixes = ['www.', 'mail.', 'email.', 'webmail.', 'secure.', 'login.', 'account.']
        for prefix in prefixes:
            if domain.startswith(prefix):
                domain = domain[len(prefix):]
                break
        
        # Remove trailing dots
        domain = domain.rstrip('.')
        
        # Remove port numbers
        if ':' in domain:
            domain = domain.split(':')[0]
        
        return domain
        
    except Exception as e:
        logger.error(f"Error normalizing domain '{domain}': {str(e)}")
        return domain.lower() if domain else ""

def safe_request(method: str, url: str, **kwargs) -> Optional[requests.Response]:
    """
    Safe wrapper for HTTP requests with error handling and timeouts
    
    Args:
        method (str): HTTP method ('GET', 'POST', etc.)
        url (str): URL to request
        **kwargs: Additional arguments for requests
        
    Returns:
        Optional[requests.Response]: Response object or None if failed
    """
    try:
        # Set default timeout if not provided
        if 'timeout' not in kwargs:
            kwargs['timeout'] = 10
        
        # Set default headers if not provided
        if 'headers' not in kwargs:
            kwargs['headers'] = {}
        
        # Add user agent if not present
        if 'User-Agent' not in kwargs['headers']:
            kwargs['headers']['User-Agent'] = 'PhishingDetector/1.0'
        
        # Make the request
        response = requests.request(method, url, **kwargs)
        
        # Log the request
        logger.debug(f"{method} {url} - Status: {response.status_code}")
        
        return response
        
    except requests.exceptions.Timeout:
        logger.warning(f"Request timeout for {method} {url}")
        return None
    except requests.exceptions.ConnectionError:
        logger.warning(f"Connection error for {method} {url}")
        return None
    except requests.exceptions.HTTPError as e:
        logger.warning(f"HTTP error for {method} {url}: {str(e)}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Request exception for {method} {url}: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error for {method} {url}: {str(e)}")
        return None

def safe_get(url: str, **kwargs) -> Optional[requests.Response]:
    """
    Safe GET request wrapper
    
    Args:
        url (str): URL to request
        **kwargs: Additional arguments for requests
        
    Returns:
        Optional[requests.Response]: Response object or None if failed
    """
    return safe_request('GET', url, **kwargs)

def safe_post(url: str, **kwargs) -> Optional[requests.Response]:
    """
    Safe POST request wrapper
    
    Args:
        url (str): URL to request
        **kwargs: Additional arguments for requests
        
    Returns:
        Optional[requests.Response]: Response object or None if failed
    """
    return safe_request('POST', url, **kwargs)

def extract_domain_from_url(url: str) -> str:
    """
    Extract domain from URL
    
    Args:
        url (str): URL to extract domain from
        
    Returns:
        str: Domain name or empty string if extraction fails
    """
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower()
    except Exception as e:
        logger.error(f"Error extracting domain from URL '{url}': {str(e)}")
        return ""

def is_suspicious_url_pattern(url: str) -> Dict[str, Any]:
    """
    Check URL for suspicious patterns
    
    Args:
        url (str): URL to analyze
        
    Returns:
        Dict[str, Any]: Dictionary with pattern analysis results
    """
    patterns = {
        'has_ip_address': False,
        'has_suspicious_tld': False,
        'has_url_shortener': False,
        'has_suspicious_keywords': False,
        'has_excessive_subdomains': False,
        'suspicious_patterns': []
    }
    
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        # Check for IP address
        if re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?$', domain):
            patterns['has_ip_address'] = True
            patterns['suspicious_patterns'].append('IP address used instead of domain')
        
        # Check for suspicious TLDs
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download', '.science', '.work']
        for tld in suspicious_tlds:
            if domain.endswith(tld):
                patterns['has_suspicious_tld'] = True
                patterns['suspicious_patterns'].append(f'Suspicious TLD: {tld}')
                break
        
        # Check for URL shorteners
        url_shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link']
        for shortener in url_shorteners:
            if shortener in domain:
                patterns['has_url_shortener'] = True
                patterns['suspicious_patterns'].append(f'URL shortener: {shortener}')
                break
        
        # Check for suspicious keywords
        suspicious_keywords = ['secure', 'account', 'verify', 'login', 'update', 'confirm', 'bank', 'paypal']
        for keyword in suspicious_keywords:
            if keyword in url.lower():
                patterns['has_suspicious_keywords'] = True
                patterns['suspicious_patterns'].append(f'Suspicious keyword: {keyword}')
                break
        
        # Check for excessive subdomains
        domain_parts = domain.split('.')
        if len(domain_parts) > 4:
            patterns['has_excessive_subdomains'] = True
            patterns['suspicious_patterns'].append('Excessive subdomains')
        
    except Exception as e:
        logger.error(f"Error analyzing URL patterns for '{url}': {str(e)}")
    
    return patterns

def calculate_domain_similarity(domain1: str, domain2: str) -> float:
    """
    Calculate similarity between two domains using Levenshtein distance
    
    Args:
        domain1 (str): First domain
        domain2 (str): Second domain
        
    Returns:
        float: Similarity score between 0 and 1 (1 = identical)
    """
    if not domain1 or not domain2:
        return 0.0
    
    try:
        # Normalize domains
        d1 = normalize_domain(domain1)
        d2 = normalize_domain(domain2)
        
        if d1 == d2:
            return 1.0
        
        # Calculate Levenshtein distance
        distance = _levenshtein_distance(d1, d2)
        max_len = max(len(d1), len(d2))
        
        if max_len == 0:
            return 1.0
        
        # Convert to similarity score
        similarity = 1.0 - (distance / max_len)
        return max(0.0, similarity)
        
    except Exception as e:
        logger.error(f"Error calculating domain similarity: {str(e)}")
        return 0.0

def _levenshtein_distance(s1: str, s2: str) -> int:
    """
    Calculate Levenshtein distance between two strings
    
    Args:
        s1 (str): First string
        s2 (str): Second string
        
    Returns:
        int: Levenshtein distance
    """
    if len(s1) < len(s2):
        return _levenshtein_distance(s2, s1)
    
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

def clean_text(text: str) -> str:
    """
    Clean text by removing extra whitespace and normalizing
    
    Args:
        text (str): Text to clean
        
    Returns:
        str: Cleaned text
    """
    if not text:
        return ""
    
    try:
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Remove HTML tags (basic)
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove excessive punctuation
        text = re.sub(r'[!]{3,}', '!!!', text)
        text = re.sub(r'[?]{3,}', '???', text)
        
        return text
        
    except Exception as e:
        logger.error(f"Error cleaning text: {str(e)}")
        return text
