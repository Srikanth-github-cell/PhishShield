// Background service worker for PhishGuard Pro
const API_BASE_URL = 'http://localhost:5000';

// Storage keys
const STORAGE_KEYS = {
  LAST_SCAN: 'lastScan',
  SCAN_HISTORY: 'scanHistory',
  SETTINGS: 'settings'
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('PhishGuard Pro installed');
  
  // Set default settings
  chrome.storage.local.set({
    [STORAGE_KEYS.SETTINGS]: {
      autoScan: true,
      notifications: true,
      theme: 'dark'
    },
    [STORAGE_KEYS.SCAN_HISTORY]: []
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'scanUrl':
      handleUrlScan(request.url, sendResponse);
      break;
    case 'scanEmail':
      handleEmailScan(request.emailData, sendResponse);
      break;
    case 'getCurrentTab':
      getCurrentTab(sendResponse);
      break;
    case 'getStoredResults':
      getStoredResults(sendResponse);
      break;
    case 'clearHistory':
      clearScanHistory(sendResponse);
      break;
    case 'openPopup':
      openExtensionPopup(sendResponse);
      break;
    case 'scanCurrentURL':
      scanCurrentURL(sender.tab.id, sendResponse);
      break;
    default:
      sendResponse({ error: 'Unknown action' });
  }
  
  return true; // Keep message channel open for async response
});
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}


// Handle URL scanning
async function handleUrlScan(url, sendResponse) {
  try {
    console.log('Scanning URL:', url);
    
    // Validate URL
    if (!url || !isValidURL(url)) {
      throw new Error('Invalid URL provided');
    }
    
    const response = await fetch(`${API_BASE_URL}/scan_url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('URL scan result:', result);
    
    // Ensure result has required fields
    const normalizedResult = {
      url: url,
      is_phishing: result.is_phishing || false,
      risk_level: result.risk_level || 'unknown',
      score: result.score || 0,
      details: result.details || {},
      timestamp: Date.now()
    };
    
    // Store the result
    await storeResult('url', normalizedResult);
    
    // Show notification if high risk
    if (normalizedResult.risk_level === 'high' || normalizedResult.risk_level === 'critical') {
      showNotification('Warning: Suspicious URL detected!', `${new URL(url).hostname} may be malicious.`);
    }
    
    sendResponse({ success: true, data: normalizedResult });
  } catch (error) {
    console.error('URL scan error:', error);
    const errorResult = {
      url: url,
      is_phishing: false,
      risk_level: 'unknown',
      score: 0,
      error: error.message || 'Failed to connect to scanning service',
      timestamp: Date.now()
    };
    
    // Store error result for history
    await storeResult('url', errorResult);
    
    sendResponse({ 
      success: false, 
      error: error.message,
      data: errorResult
    });
  }
}

// Handle email scanning
async function handleEmailScan(emailData, sendResponse) {
  try {
    console.log('Scanning email:', emailData);
    
    const response = await fetch(`${API_BASE_URL}/scan_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Email scan result:', result);
    
    // Normalize result
    const normalizedResult = {
      sender: emailData.sender,
      subject: emailData.subject,
      is_phishing: result.is_phishing || false,
      risk_level: result.risk_level || 'unknown',
      score: result.score || 0,
      details: result.details || {},
      timestamp: Date.now()
    };
    
    // Store the result
    await storeResult('email', normalizedResult);
    
    // Show notification if high risk
    if (normalizedResult.risk_level === 'high' || normalizedResult.risk_level === 'critical') {
      showNotification('Warning: Suspicious email detected!', `Email from ${emailData.sender} may be malicious.`);
    }
    
    sendResponse({ success: true, data: normalizedResult });
  } catch (error) {
    console.error('Email scan error:', error);
    const errorResult = {
      sender: emailData.sender,
      subject: emailData.subject,
      is_phishing: false,
      risk_level: 'unknown',
      score: 0,
      error: error.message || 'Failed to connect to scanning service',
      timestamp: Date.now()
    };
    
    sendResponse({ 
      success: false, 
      error: error.message,
      data: errorResult
    });
  }
}

// Get current tab information
async function getCurrentTab(sendResponse) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    sendResponse({ success: true, data: tab });
  } catch (error) {
    console.error('Error getting current tab:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Open extension popup
async function openExtensionPopup(sendResponse) {
  try {
    // This will open the extension popup
    chrome.action.openPopup();
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error opening popup:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Scan current URL (triggered from popup)
async function scanCurrentURL(tabId, sendResponse) {
  try {
    // Send message to content script to scan current URL
    chrome.tabs.sendMessage(tabId, { action: 'scanCurrentURL' }, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, data: response });
      }
    });
  } catch (error) {
    console.error('Error scanning current URL:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Store scan result
async function storeResult(type, result) {
  try {
    // Store last scan
    await chrome.storage.local.set({
      [STORAGE_KEYS.LAST_SCAN]: {
        type,
        result,
        timestamp: Date.now()
      }
    });
    
    // Add to history
    const { scanHistory = [] } = await chrome.storage.local.get([STORAGE_KEYS.SCAN_HISTORY]);
    const newEntry = {
      id: Date.now(),
      type,
      result,
      timestamp: Date.now()
    };
    
    // Keep only last 100 entries
    const updatedHistory = [newEntry, ...scanHistory.slice(0, 99)];
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SCAN_HISTORY]: updatedHistory
    });
    
    console.log('Result stored successfully');
  } catch (error) {
    console.error('Error storing result:', error);
  }
}

// Get stored results
async function getStoredResults(sendResponse) {
  try {
    const data = await chrome.storage.local.get([STORAGE_KEYS.LAST_SCAN, STORAGE_KEYS.SCAN_HISTORY]);
    sendResponse({ success: true, data });
  } catch (error) {
    console.error('Error getting stored results:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Clear scan history
async function clearScanHistory(sendResponse) {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SCAN_HISTORY]: []
    });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error clearing history:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Show notification
async function showNotification(title, message) {
  try {
    const { settings } = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
    
    if (settings?.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title,
        message
      });
    }
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Health check on startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    console.log('Backend health check:', response.ok ? 'OK' : 'Failed');
  } catch (error) {
    console.error('Backend health check failed:', error);
  }
});
