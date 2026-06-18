// URL Scanner content script for PhishGuard Pro
// Automatically scans current page URL for phishing threats

class PhishGuardURLScanner {
  constructor() {
    this.isScanning = false;
    this.currentUrl = null;
    this.scanPrompt = null;
    this.hasScanned = false;
    this.initURLScanning();
  }

  initURLScanning() {
    console.log('PhishGuard URL Scanner: Initializing');
    
    // Skip if this is an email domain (shouldn't happen due to exclude_matches, but double check)
    const hostname = window.location.hostname;
    if (hostname.includes('mail.google.com') || 
        hostname.includes('outlook.live.com') || 
        hostname.includes('mail.yahoo.com')) {
      console.log('PhishGuard URL Scanner: Skipping email domain');
      return;
    }

    // Get current URL
    this.currentUrl = window.location.href;
    
    // Skip local/internal URLs
    if (this.shouldSkipURL(this.currentUrl)) {
      console.log('PhishGuard URL Scanner: Skipping internal URL');
      return;
    }

    // Wait for page to load completely
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.startAutoScan(), 2000);
      });
    } else {
      setTimeout(() => this.startAutoScan(), 2000);
    }

    // Monitor for URL changes (SPAs)
    this.monitorURLChanges();
  }

  shouldSkipURL(url) {
    const skipPatterns = [
      /^chrome:/,
      /^chrome-extension:/,
      /^moz-extension:/,
      /^about:/,
      /^file:/,
      /^data:/,
      /^blob:/,
      /localhost/,
      /127\.0\.0\.1/,
      /192\.168\./,
      /10\./,
      /172\.(1[6-9]|2[0-9]|3[01])\./
    ];

    return skipPatterns.some(pattern => pattern.test(url));
  }

  monitorURLChanges() {
    let lastUrl = this.currentUrl;
    
    // Check for URL changes every 2 seconds
    setInterval(() => {
      if (window.location.href !== lastUrl && !this.shouldSkipURL(window.location.href)) {
        lastUrl = window.location.href;
        this.currentUrl = lastUrl;
        this.hasScanned = false;
        
        // Wait a bit for page to load
        setTimeout(() => this.startAutoScan(), 3000);
      }
    }, 2000);
  }

  startAutoScan() {
    if (this.isScanning || this.hasScanned) return;
    
    console.log('PhishGuard URL Scanner: Starting auto scan for', this.currentUrl);
    this.hasScanned = true;
    
    // Show scanning prompt
    this.showScanningPrompt();
    
    // Start scan
    this.performURLScan(this.currentUrl);
  }

  performURLScan(url) {
    this.isScanning = true;
    
    // Send URL to background script
    chrome.runtime.sendMessage({
      action: 'scanUrl',
      url: url
    }, (response) => {
      this.isScanning = false;
      this.hideScanningPrompt();
      
      if (response && response.success) {
        this.showScanResults(response.data);
      } else {
        this.showScanError(response?.error || 'Unknown error');
      }
    });
  }

  showScanningPrompt() {
    if (this.scanPrompt) {
      this.scanPrompt.remove();
    }
    
    this.scanPrompt = this.createScanningPrompt();
    document.body.appendChild(this.scanPrompt);
  }

  createScanningPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'phishguard-prompt phishguard-loading phishguard-url-scanner';
    
    const domain = new URL(this.currentUrl).hostname;
    
    prompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <div class="phishguard-spinner"></div>
          <span>PhishGuard Pro</span>
        </div>
        <div class="phishguard-message">
          <p>🔍 <strong>Scanning URL for threats...</strong></p>
          <p class="phishguard-details">Analyzing: ${domain}</p>
        </div>
      </div>
    `;
    
    return prompt;
  }

  hideScanningPrompt() {
    if (this.scanPrompt) {
      this.scanPrompt.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (this.scanPrompt) {
          this.scanPrompt.remove();
          this.scanPrompt = null;
        }
      }, 300);
    }
  }

  showScanResults(result) {
    // Only show results if there's a potential threat
    const riskLevel = result.risk_level || 'unknown';
    const shouldShow = riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical' || result.is_phishing;
    
    if (!shouldShow) {
      console.log('PhishGuard URL Scanner: URL is safe, not showing prompt');
      return;
    }
    
    const resultsPrompt = this.createResultsPrompt(result);
    document.body.appendChild(resultsPrompt);
    
    // Auto-hide after 20 seconds
    setTimeout(() => {
      if (resultsPrompt && resultsPrompt.parentNode) {
        resultsPrompt.style.transform = 'translateY(-100%)';
        setTimeout(() => {
          if (resultsPrompt.parentNode) {
            resultsPrompt.remove();
          }
        }, 300);
      }
    }, 20000);
  }

  createResultsPrompt(result) {
    const riskLevel = result.risk_level || 'unknown';
    const isPhishing = result.is_phishing;
    const score = result.score || 0;
    const url = result.url || this.currentUrl;
    const domain = new URL(url).hostname;
    
    const getRiskColor = (level) => {
      switch (level) {
        case 'low': return '#00ff88';
        case 'medium': return '#ffaa00';
        case 'high': return '#ff6600';
        case 'critical': return '#ff0066';
        default: return '#888';
      }
    };
    
    const getRiskIcon = (level) => {
      switch (level) {
        case 'low': return '✅';
        case 'medium': return '⚠️';
        case 'high': return '🚨';
        case 'critical': return '🔴';
        default: return '❓';
      }
    };
    
    const prompt = document.createElement('div');
    prompt.className = 'phishguard-prompt phishguard-results phishguard-url-results';
    
    prompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <span style="color: ${getRiskColor(riskLevel)};">${getRiskIcon(riskLevel)}</span>
          <span>PhishGuard Pro - URL Scan</span>
        </div>
        <div class="phishguard-message">
          <div class="phishguard-risk-badge" style="background: ${getRiskColor(riskLevel)}20; border-color: ${getRiskColor(riskLevel)};">
            <strong>${riskLevel.toUpperCase()}</strong> Risk
            <span class="phishguard-score">Score: ${score}</span>
          </div>
          ${isPhishing ? '<p class="phishguard-warning">⚠️ This website may be malicious!</p>' : ''}
          <p class="phishguard-details">Domain: ${domain}</p>
          <p class="phishguard-details">Click extension icon for full details</p>
        </div>
        <div class="phishguard-buttons">
          <button class="phishguard-btn phishguard-btn-primary" data-action="view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View Details
          </button>
          <button class="phishguard-btn phishguard-btn-secondary" data-action="dismiss">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            Dismiss
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    prompt.querySelector('[data-action="view"]').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
      prompt.remove();
    });
    
    prompt.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
      prompt.remove();
    });
    
    return prompt;
  }

  showScanError(error) {
    // Only show error if it's a critical failure
    if (error.includes('Failed to connect')) {
      console.log('PhishGuard URL Scanner: Backend unavailable, silently failing');
      return;
    }
    
    const errorPrompt = document.createElement('div');
    errorPrompt.className = 'phishguard-prompt phishguard-error';
    
    errorPrompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <span style="color: #ff4444;">❌</span>
          <span>PhishGuard Pro</span>
        </div>
        <div class="phishguard-message">
          <p><strong>URL scan failed</strong></p>
          <p class="phishguard-details">${error}</p>
        </div>
        <div class="phishguard-buttons">
          <button class="phishguard-btn phishguard-btn-secondary" data-action="dismiss">
            Dismiss
          </button>
        </div>
      </div>
    `;
    
    errorPrompt.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
      errorPrompt.remove();
    });
    
    document.body.appendChild(errorPrompt);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (errorPrompt.parentNode) {
        errorPrompt.remove();
      }
    }, 8000);
  }

  // Public method to manually scan current URL
  scanCurrentURL() {
    if (this.isScanning) return;
    
    this.hasScanned = false;
    this.startAutoScan();
  }
}

// Initialize URL scanner when DOM is ready
let urlScanner;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    urlScanner = new PhishGuardURLScanner();
  });
} else {
  urlScanner = new PhishGuardURLScanner();
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanCurrentURL' && urlScanner) {
    urlScanner.scanCurrentURL();
    sendResponse({ success: true });
  }
});

// Export for potential use
window.PhishGuardURLScanner = urlScanner;