# SecureNode SOC — Cybersecurity Operations Center Dashboard

A premium, interactive real-time security analytics console built with **React** and **Vite**, designed for security analysts and operations center teams. The dashboard features real-time network traffic logs, server infrastructure matrices, a threat intelligence hub with intrusion detection systems (IDS), and interactive audit log ledgers.

🚀 **Live Site URL**: [https://lelyaler.github.io/project/](https://lelyaler.github.io/project/)

---

## ✨ Features

### 📊 Real-Time Operations Console
- **KPI Metrics Grid**: Track Total Network Packets, Blocked Threats, Active Socket Connections, and Intrusion Alerts with growth and warning indicators.
- **Dynamic Charting**: Interactive area charts comparing traffic throughput vs. blocked anomalies over time, built using **Recharts**.
- **Live Network Feed**: A simulated real-time feed displaying socket requests, payload size, ports, and server response codes with smooth animations.

### 🖥️ Server Infrastructure Matrix
- Comprehensive health and performance logs for various microservices, database clusters, caching nodes, load balancers, and edge gateways.
- Visual statistics detailing CPU Load, Active Processing Threads, and Transferred Data volumes.
- Full-text search and category filtering with detail profile drawers.

### 🛡️ Threat Intelligence & IDS
- Case management center to quarantine malicious IPs, audit attack vectors, and resolve security incident alerts.
- High, Medium, and Low risk classification indicators.
- Detailed intrusion logs tracing request patterns, routing signatures, and malicious queries.

### ⚙️ System Access Audit Logs
- Comprehensive ledger tracking administrative access, script executions, API queries, and server file writes.
- Advanced filters for log types (File Write, SSH Access, API Call) and execution statuses.
- Interactive export module to compile server log reports into CSV formats.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vite.dev/)
- **Charts**: [Recharts](https://recharts.org/) (Responsive SVG Graphs)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom properties, Flexbox/Grid layouts, Glassmorphic filters, Keyframe transitions)
- **Deployment**: [gh-pages](https://www.npmjs.com/package/gh-pages)

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── DashboardView.jsx      # KPI statistics, Recharts graphs, and live socket feed
│   ├── GamesView.jsx          # Server list matrix cards and detail profiles drawer
│   ├── FraudView.jsx          # Security alerts center, IP quarantine, and logs audit modal
│   ├── TransactionsView.jsx   # System access logs and interactive CSV exporter
│   ├── Sidebar.jsx            # Left navigation bar and system status indicators
│   └── Header.jsx             # Top widgets, active connection counter, and analyst profile
├── utils/
│   └── mockData.js            # Offline database structure
├── App.jsx                    # Root layout and tab router
├── index.css                  # Global CSS variables, reset styles, and glassmorphic utility classes
└── main.jsx                   # Entry point
```

---

## 💻 Local Development Setup

To run this dashboard project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lelyaler/project.git
   cd project
   ```

2. **Install all package dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173/project/](http://localhost:5173/project/) in your web browser.
