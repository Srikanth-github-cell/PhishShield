// popup.js - PhishGuard Pro Popup Interface
// Handles displaying scan results for both email and URL scans with glassmorphic UI

class PhishGuardPopup {
    constructor() {
        this.currentTab = null;
        this.scanResults = null;
        this.isLoading = false;

        // DOM elements
        this.elements = {
            loadingContainer: null,
            resultsContainer: null,
            errorContainer: null,
            scanButton: null,
            riskIndicator: null,
            riskScore: null,
            riskLevel: null,
            detailsContainer: null,
            tabInfo: null,
            scanType: null
        };

        this.init();
    }

    async init() {
        console.log('PhishGuard Popup: Initializing...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializePopup());
        } else {
            this.initializePopup();
        }
    }

    async initializePopup() {
        this.cacheElements();
        this.setupEventListeners();
        await this.getCurrentTab();
        await this.checkForExistingResults();
        this.updateUIState();
    }

    cacheElements() {
        this.elements = {
            loadingContainer: document.getElementById('loading-container'),
            resultsContainer: document.getElementById('results-container'),
            errorContainer: document.getElementById('error-container'),
            scanButton: document.getElementById('scan-button'),
            riskIndicator: document.getElementById('risk-indicator'),
            riskScore: document.getElementById('risk-score'),
            riskLevel: document.getElementById('risk-level'),
            detailsContainer: document.getElementById('details-container'),
            tabInfo: document.getElementById('tab-info'),
            scanType: document.getElementById('scan-type')
        };
    }

    setupEventListeners() {
        if (this.elements.scanButton) {
            this.elements.scanButton.addEventListener('click', () => this.handleScanClick());
        }
    }

    async getCurrentTab() {
        try {
            const response = await this.sendMessageToBackground('getCurrentTab');
            if (response.success) {
                this.currentTab = response.data;
                this.updateTabInfo();
            }
        } catch (error) {
            console.error('Error getting current tab:', error);
        }
    }

    async checkForExistingResults() {
        try {
            const response = await this.sendMessageToBackground('getStoredResults');
            if (response.success && response.data.lastScan) {
                const { lastScan } = response.data;
                const scanAge = Date.now() - lastScan.timestamp;
                if (scanAge < 5 * 60 * 1000) {
                    this.scanResults = lastScan;
                    this.displayResults(lastScan.result, lastScan.type);
                    return;
                }
            }

            if (this.shouldAutoScan()) {
                this.startAutoScan();
            }
        } catch (error) {
            console.error('Error checking for existing results:', error);
        }
    }

    shouldAutoScan() {
        if (!this.currentTab) return false;
        const hostname = new URL(this.currentTab.url).hostname;
        const supportedDomains = ['mail.google.com', 'outlook.live.com', 'mail.yahoo.com'];
        return supportedDomains.some(domain => hostname.includes(domain));
    }

    async startAutoScan() {
        this.showLoading('Checking for recent email activity...');
        setTimeout(async () => {
            const response = await this.sendMessageToBackground('getStoredResults');
            if (response.success && response.data.lastScan) {
                const { lastScan } = response.data;
                const scanAge = Date.now() - lastScan.timestamp;
                if (scanAge < 2 * 60 * 1000) {
                    this.scanResults = lastScan;
                    this.displayResults(lastScan.result, lastScan.type);
                } else {
                    this.showNoRecentActivity();
                }
            } else {
                this.showNoRecentActivity();
            }
        }, 1000);
    }

    updateUIState() {
        if (this.elements.scanButton) {
            this.elements.scanButton.textContent = this.scanResults ? '🔁 Rescan' : '🔄 Scan This Page';
            this.elements.scanButton.disabled = false;
        }
    }

    async handleScanClick() {
        if (!this.currentTab) return;

        const url = this.currentTab.url;
        const hostname = new URL(url).hostname;

        if (hostname.includes('mail.google.com') || 
            hostname.includes('outlook.live.com') || 
            hostname.includes('mail.yahoo.com')) {
            this.showError('Please open an email to scan, then click the extension icon.');
            return;
        }

        this.startUrlScan(url);
    }

    async startUrlScan(url) {
        this.showLoading('Scanning URL for threats...');
        try {
            const response = await this.sendMessageToBackground('scanUrl', { url });
            if (response.success) {
                this.scanResults = { type: 'url', result: response.data, timestamp: Date.now() };
                this.displayResults(response.data, 'url');
            } else {
                this.showError(response.error || 'Failed to scan URL');
            }
        } catch (error) {
            console.error('URL scan error:', error);
            this.showError('Failed to scan URL. Please try again.');
        }
    }

    displayResults(result, type) {
        this.hideLoading();
        this.hideError();
        this.updateRiskIndicator(result);

        if (type === 'email') {
            this.displayEmailResults(result);
        } else {
            this.displayUrlResults(result);
        }

        this.showResultsContainer();
    }

    updateRiskIndicator(result) {
        const riskLevel = result.risk_level || 'unknown';
        const isPhishing = result.is_phishing;
        let rawScore = result.score;
        let normalizedScore = 0;

        if (typeof rawScore === 'number') {
            normalizedScore = rawScore <= 1 ? Math.round(rawScore * 100) :
                              rawScore <= 10 ? Math.round(rawScore * 10) :
                              Math.round(rawScore);
        }

        if (this.elements.riskScore) {
            this.elements.riskScore.textContent = `${normalizedScore}%`;
        }

        if (this.elements.riskLevel) {
            this.elements.riskLevel.textContent = riskLevel.toUpperCase();
            this.elements.riskLevel.className = `risk-level risk-${riskLevel}`;
        }

        if (this.elements.riskIndicator) {
            const colors = {
                low: '#00ff88',
                medium: '#ffaa00',
                high: '#ff6600',
                critical: '#ff0066',
                unknown: '#888888'
            };

            const icons = {
                low: '✅',
                medium: '⚠️',
                high: '🚨',
                critical: '🔴',
                unknown: '❓'
            };

            this.elements.riskIndicator.style.setProperty('--risk-color', colors[riskLevel]);
            this.elements.riskIndicator.innerHTML = `
                <div class="risk-icon">${icons[riskLevel]}</div>
                <div class="risk-text">
                    <span class="risk-verdict">${isPhishing ? 'PHISHING DETECTED' : 'ANALYSIS COMPLETE'}</span>
                    <span class="risk-description">${this.getRiskDescription(riskLevel)}</span>
                </div>
            `;
            this.elements.riskIndicator.classList.add('animate-in');
        }
    }

    displayEmailResults(result) {
        if (!this.elements.detailsContainer) return;

        const details = `
            <div class="result-section">
                <h3>📧 Email Analysis</h3>
                <div class="detail-item"><span class="label">Subject:</span><span class="value">${this.escapeHtml(result.subject || 'N/A')}</span></div>
                <div class="detail-item"><span class="label">Sender:</span><span class="value">${this.escapeHtml(result.sender || 'N/A')}</span></div>
                ${result.keywords ? `<div class="detail-item"><span class="label">Keywords:</span><span class="value">${result.keywords.join(', ')}</span></div>` : ''}
                ${result.attachments?.length ? `<div class="detail-item"><span class="label">Attachments:</span><span class="value">${result.attachments.join(', ')}</span></div>` : ''}
                ${result.urls?.length ? `<div class="detail-item"><span class="label">Links Found:</span><span class="value">${result.urls.length} link(s)</span></div>` : ''}
            </div>
            ${result.analysis ? `<div class="result-section"><h3>🔍 Analysis Details</h3><div class="analysis-text">${this.escapeHtml(result.analysis)}</div></div>` : ''}
        `;
        this.elements.detailsContainer.innerHTML = details;
        this.updateScanType('Email');
    }

    displayUrlResults(result) {
        if (!this.elements.detailsContainer) return;

        const details = `
            <div class="result-section">
                <h3>🔗 URL Analysis</h3>
                <div class="detail-item"><span class="label">URL:</span><span class="value url-value">${this.escapeHtml(result.url || 'N/A')}</span></div>
                ${result.virus_total ? `<div class="detail-item"><span class="label">VirusTotal:</span><span class="value">${result.virus_total.malicious || 0} malicious detections</span></div>` : ''}
                ${result.urlhaus ? `<div class="detail-item"><span class="label">URLhaus:</span><span class="value">${result.urlhaus.threat || 'Clean'}</span></div>` : ''}
                ${result.payloads?.length ? `<div class="detail-item"><span class="label">Payloads:</span><span class="value">${result.payloads.length} detected</span></div>` : ''}
            </div>
            ${result.analysis ? `<div class="result-section"><h3>🔍 Analysis Details</h3><div class="analysis-text">${this.escapeHtml(result.analysis)}</div></div>` : ''}
        `;
        this.elements.detailsContainer.innerHTML = details;
        this.updateScanType('URL');
    }

    getRiskDescription(level) {
        const descriptions = {
            low: 'Low risk detected',
            medium: 'Medium risk - review carefully',
            high: 'High risk - exercise caution',
            critical: 'Critical risk - avoid interaction',
            unknown: 'Unable to determine risk'
        };
        return descriptions[level] || 'Unknown risk level';
    }

    showLoading(message = 'Scanning...') {
        if (this.elements.loadingContainer) {
            this.elements.loadingContainer.querySelector('.loading-text').textContent = message;
            this.elements.loadingContainer.style.display = 'flex';
            this.elements.loadingContainer.classList.add('animate-in');
        }
        this.hideResults();
        this.hideError();
        this.isLoading = true;
    }

    hideLoading() {
        if (this.elements.loadingContainer) {
            this.elements.loadingContainer.style.display = 'none';
            this.elements.loadingContainer.classList.remove('animate-in');
        }
        this.isLoading = false;
    }

    showError(message) {
        if (this.elements.errorContainer) {
            this.elements.errorContainer.querySelector('.error-text').textContent = message;
            this.elements.errorContainer.style.display = 'block';
            this.elements.errorContainer.classList.add('animate-in');
        }
        this.hideLoading();
        this.hideResults();
    }

    hideError() {
        if (this.elements.errorContainer) {
            this.elements.errorContainer.style.display = 'none';
            this.elements.errorContainer.classList.remove('animate-in');
        }
    }

    showResultsContainer() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.style.display = 'block';
            this.elements.resultsContainer.classList.add('animate-in');
        }
    }

    hideResults() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.style.display = 'none';
            this.elements.resultsContainer.classList.remove('animate-in');
        }
    }

    showNoRecentActivity() {
        this.hideLoading();
        this.showError('No recent email activity detected. Open an email and try again.');
    }

    updateTabInfo() {
        if (this.elements.tabInfo && this.currentTab) {
            const hostname = new URL(this.currentTab.url).hostname;
            this.elements.tabInfo.textContent = hostname;
        }
    }

    updateScanType(type) {
        if (this.elements.scanType) {
            this.elements.scanType.textContent = type;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sendMessageToBackground(action, data = {}) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ action, ...data }, (response) => {
                resolve(response || { success: false, error: 'No response' });
            });
        });
    }
}

// Initialize popup
let popup;
document.addEventListener('DOMContentLoaded', () => {
    popup = new PhishGuardPopup();
});
window.popup = popup;
