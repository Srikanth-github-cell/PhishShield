// Content script for PhishGuard Pro
// Detects and extracts email content from Gmail, Outlook, and Yahoo Mail

class PhishGuardContent {
  constructor() {
    this.isScanning = false;
    this.currentEmail = null;
    this.scanPrompt = null;
    this.initEmailDetection();
  }

  initEmailDetection() {
    console.log('PhishGuard Content: Initializing email detection');
    
    // Detect email provider
    const hostname = window.location.hostname;
    
    if (hostname.includes('mail.google.com')) {
      this.provider = 'gmail';
      this.initGmailDetection();
    } else if (hostname.includes('outlook.live.com')) {
      this.provider = 'outlook';
      this.initOutlookDetection();
    } else if (hostname.includes('mail.yahoo.com')) {
      this.provider = 'yahoo';
      this.initYahooDetection();
    }
  }

  initGmailDetection() {
    console.log('PhishGuard: Initializing Gmail detection');
    
    // Observer for Gmail interface changes
    const observer = new MutationObserver(() => {
      this.detectGmailEmail();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Initial detection
    setTimeout(() => this.detectGmailEmail(), 2000);
  }

  initOutlookDetection() {
    console.log('PhishGuard: Initializing Outlook detection');
    
    const observer = new MutationObserver(() => {
      this.detectOutlookEmail();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => this.detectOutlookEmail(), 2000);
  }

  initYahooDetection() {
    console.log('PhishGuard: Initializing Yahoo detection');
    
    const observer = new MutationObserver(() => {
      this.detectYahooEmail();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => this.detectYahooEmail(), 2000);
  }

  detectGmailEmail() {
    // Gmail email view selectors
    const emailContainer = document.querySelector('[data-message-id], .ii.gt div[dir="ltr"]');
    
    if (!emailContainer || this.isScanning) return;
    
    try {
      const subject = this.extractGmailSubject();
      const sender = this.extractGmailSender();
      const body = this.extractGmailBody();
      
      if (subject && sender && body) {
        const emailData = {
          subject,
          sender,
          body,
          urls: this.extractUrls(body),
          attachments: this.extractGmailAttachments()
        };
        
        if (this.isNewEmail(emailData)) {
          this.currentEmail = emailData;
          this.showScanPrompt(emailData);
        }
      }
    } catch (error) {
      console.error('Gmail detection error:', error);
    }
  }

  detectOutlookEmail() {
    const emailContainer = document.querySelector('[role="main"] [data-testid="MessageBody"], .rps_d9e7');
    
    if (!emailContainer || this.isScanning) return;
    
    try {
      const subject = this.extractOutlookSubject();
      const sender = this.extractOutlookSender();
      const body = this.extractOutlookBody();
      
      if (subject && sender && body) {
        const emailData = {
          subject,
          sender,
          body,
          urls: this.extractUrls(body),
          attachments: this.extractOutlookAttachments()
        };
        
        if (this.isNewEmail(emailData)) {
          this.currentEmail = emailData;
          this.showScanPrompt(emailData);
        }
      }
    } catch (error) {
      console.error('Outlook detection error:', error);
    }
  }

  detectYahooEmail() {
    const emailContainer = document.querySelector('[data-test-id="message-view-body-content"]');
    
    if (!emailContainer || this.isScanning) return;
    
    try {
      const subject = this.extractYahooSubject();
      const sender = this.extractYahooSender();
      const body = this.extractYahooBody();
      
      if (subject && sender && body) {
        const emailData = {
          subject,
          sender,
          body,
          urls: this.extractUrls(body),
          attachments: this.extractYahooAttachments()
        };
        
        if (this.isNewEmail(emailData)) {
          this.currentEmail = emailData;
          this.showScanPrompt(emailData);
        }
      }
    } catch (error) {
      console.error('Yahoo detection error:', error);
    }
  }

  // Gmail extraction methods
  extractGmailSubject() {
    const subjectElement = document.querySelector('h2[data-thread-id], .hP');
    return subjectElement ? subjectElement.textContent.trim() : '';
  }

  extractGmailSender() {
    const senderElement = document.querySelector('.go span[email], .gD[email]');
    return senderElement ? senderElement.getAttribute('email') || senderElement.textContent.trim() : '';
  }

  extractGmailBody() {
    const bodyElement = document.querySelector('.ii.gt div[dir="ltr"], .a3s.aiL');
    return bodyElement ? bodyElement.textContent.trim() : '';
  }

  extractGmailAttachments() {
    const attachmentElements = document.querySelectorAll('.aZo span[title], .aQy span');
    return Array.from(attachmentElements).map(el => el.textContent.trim()).filter(Boolean);
  }

  // Outlook extraction methods
  extractOutlookSubject() {
    const subjectElement = document.querySelector('[data-testid="MessageSubject"], .rps_5b9d');
    return subjectElement ? subjectElement.textContent.trim() : '';
  }

  extractOutlookSender() {
    const senderElement = document.querySelector('[data-testid="MessageHeader"] button span, .rps_83b4');
    return senderElement ? senderElement.textContent.trim() : '';
  }

  extractOutlookBody() {
    const bodyElement = document.querySelector('[data-testid="MessageBody"], .rps_d9e7');
    return bodyElement ? bodyElement.textContent.trim() : '';
  }

  extractOutlookAttachments() {
    const attachmentElements = document.querySelectorAll('[data-testid="AttachmentName"], .rps_6c5d');
    return Array.from(attachmentElements).map(el => el.textContent.trim()).filter(Boolean);
  }

  // Yahoo extraction methods
  extractYahooSubject() {
    const subjectElement = document.querySelector('[data-test-id="message-subject"]');
    return subjectElement ? subjectElement.textContent.trim() : '';
  }

  extractYahooSender() {
    const senderElement = document.querySelector('[data-test-id="message-from-display-name"]');
    return senderElement ? senderElement.textContent.trim() : '';
  }

  extractYahooBody() {
    const bodyElement = document.querySelector('[data-test-id="message-view-body-content"]');
    return bodyElement ? bodyElement.textContent.trim() : '';
  }

  extractYahooAttachments() {
    const attachmentElements = document.querySelectorAll('[data-test-id="attachment-name"]');
    return Array.from(attachmentElements).map(el => el.textContent.trim()).filter(Boolean);
  }

  // Extract URLs from text
  extractUrls(text) {
    const urlRegex = /https?:\/\/[^\s<>"']+/gi;
    const matches = text.match(urlRegex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  // Check if this is a new email
  isNewEmail(emailData) {
    if (!this.currentEmail) return true;
    
    return this.currentEmail.subject !== emailData.subject ||
           this.currentEmail.sender !== emailData.sender ||
           this.currentEmail.body !== emailData.body;
  }

  // Show scan prompt
  showScanPrompt(emailData) {
    if (this.scanPrompt) {
      this.scanPrompt.remove();
    }
    
    this.scanPrompt = this.createScanPrompt(emailData);
    document.body.appendChild(this.scanPrompt);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (this.scanPrompt) {
        this.scanPrompt.style.transform = 'translateY(-100%)';
        setTimeout(() => this.scanPrompt?.remove(), 300);
      }
    }, 10000);
  }

  createScanPrompt(emailData) {
    const prompt = document.createElement('div');
    prompt.className = 'phishguard-prompt';
    
    prompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>PhishGuard Pro</span>
        </div>
        <div class="phishguard-message">
          <p>🛡️ <strong>Scan this email for phishing threats?</strong></p>
          <p class="phishguard-details">From: ${emailData.sender}</p>
          <p class="phishguard-details">Subject: ${emailData.subject.substring(0, 50)}...</p>
        </div>
        <div class="phishguard-buttons">
          <button class="phishguard-btn phishguard-btn-primary" data-action="scan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
            </svg>
            Scan Now
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
    prompt.querySelector('[data-action="scan"]').addEventListener('click', () => {
      this.startEmailScan(emailData);
      prompt.remove();
    });
    
    prompt.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
      prompt.remove();
    });
    
    return prompt;
  }

  startEmailScan(emailData) {
    this.isScanning = true;
    
    // Show loading state
    const loadingPrompt = this.createLoadingPrompt();
    document.body.appendChild(loadingPrompt);
    
    // Send email data to background script
    chrome.runtime.sendMessage({
      action: 'scanEmail',
      emailData: emailData
    }, (response) => {
      this.isScanning = false;
      loadingPrompt.remove();
      
      if (response.success) {
        this.showScanResults(response.data);
      } else {
        this.showScanError(response.error);
      }
    });
  }

  createLoadingPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'phishguard-prompt phishguard-loading';
    
    prompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <div class="phishguard-spinner"></div>
          <span>PhishGuard Pro</span>
        </div>
        <div class="phishguard-message">
          <p>🔍 <strong>Scanning email for threats...</strong></p>
          <p class="phishguard-details">Analyzing sender, content, and links</p>
        </div>
      </div>
    `;
    
    return prompt;
  }

  showScanResults(result) {
    const resultsPrompt = this.createResultsPrompt(result);
    document.body.appendChild(resultsPrompt);
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
      if (resultsPrompt) {
        resultsPrompt.style.transform = 'translateY(-100%)';
        setTimeout(() => resultsPrompt?.remove(), 300);
      }
    }, 15000);
  }

  createResultsPrompt(result) {
    const riskLevel = result.risk_level || 'unknown';
    const isPhishing = result.is_phishing;
    const score = result.score || 0;
    
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
    prompt.className = 'phishguard-prompt phishguard-results';
    
    prompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <span style="color: ${getRiskColor(riskLevel)};">${getRiskIcon(riskLevel)}</span>
          <span>PhishGuard Pro Results</span>
        </div>
        <div class="phishguard-message">
          <div class="phishguard-risk-badge" style="background: ${getRiskColor(riskLevel)}20; border-color: ${getRiskColor(riskLevel)};">
            <strong>${riskLevel.toUpperCase()}</strong> Risk
            <span class="phishguard-score">Score: ${score}</span>
          </div>
          ${isPhishing ? '<p class="phishguard-warning">⚠️ This email shows signs of phishing!</p>' : ''}
          <p class="phishguard-details">Click the extension icon for detailed results</p>
        </div>
        <div class="phishguard-buttons">
          <button class="phishguard-btn phishguard-btn-primary" data-action="view">
            View Details
          </button>
          <button class="phishguard-btn phishguard-btn-secondary" data-action="dismiss">
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
    const errorPrompt = document.createElement('div');
    errorPrompt.className = 'phishguard-prompt phishguard-error';
    
    errorPrompt.innerHTML = `
      <div class="phishguard-prompt-content">
        <div class="phishguard-header">
          <span style="color: #ff4444;">❌</span>
          <span>PhishGuard Pro</span>
        </div>
        <div class="phishguard-message">
          <p><strong>Scan failed</strong></p>
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
    setTimeout(() => errorPrompt.remove(), 8000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PhishGuardContent();
  });
} else {
  new PhishGuardContent();
}
