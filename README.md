# 🛡️ PhishShield

PhishShield is an AI-powered phishing detection platform that helps users identify malicious URLs and suspicious emails before they become security threats. The system analyzes websites, email content, sender information, and security indicators to provide real-time phishing detection and risk assessment.

---

## 🚀 Features

- 🔗 Phishing URL Detection
- 📧 Email Phishing Analysis
- 📊 Risk Score Generation
- ⚠️ Real-Time Threat Detection
- 🔒 Domain & HTTPS Validation
- 📈 Detailed Security Reports
- 🌐 REST API Support
- 🖥️ Modern Interactive Dashboard

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Three.js
- Recharts

### Backend
- Python
- Flask
- Flask-CORS

### Security & Analysis
- URL Pattern Analysis
- Domain Verification
- HTTPS Validation
- Email Content Inspection
- Threat Scoring Engine

---

## 📂 Project Structure

```text
PhishShield/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── scanner/
│   │   ├── url_scanner.py
│   │   └── email_scanner.py
│   │
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/PhishShield.git
cd PhishShield
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

python app.py
```

Backend Server:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend Server:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

### Scan URL

```http
POST /scan_url
```

Request:

```json
{
  "url": "https://example.com"
}
```

### Scan Email

```http
POST /scan_email
```

Request:

```json
{
  "subject": "Verify Your Account",
  "sender": "support@example.com",
  "body": "Click the link below...",
  "urls": [
    "https://example.com"
  ]
}
```

---

## 🔍 How It Works

### URL Analysis

1. User submits a URL.
2. The system validates the URL structure.
3. Domain and security indicators are analyzed.
4. Risk factors are evaluated.
5. A phishing probability score is generated.
6. Results are displayed to the user.

### Email Analysis

1. User submits email content.
2. Sender information is verified.
3. Email text is analyzed for phishing indicators.
4. Embedded URLs are inspected.
5. Risk score is calculated.
6. A detailed threat report is generated.

---

## 📈 Future Enhancements

- Machine Learning-Based Detection
- WHOIS Domain Intelligence
- VirusTotal Integration
- Browser Extension Support
- Real-Time Threat Intelligence
- Scan History Dashboard
- Malware Attachment Analysis

---

## 👨‍💻 Author

**Srikanth**

B.Tech Student | Cybersecurity Enthusiast | Full-Stack Developer

- Cisco Certified Ethical Hacking
- Passionate About Cybersecurity & Web Development

---

## 📜 License

This project is licensed under the MIT License.

---

### 🛡️ PhishShield — Detect. Analyze. Protect.
A smarter way to stay safe from phishing attacks.
