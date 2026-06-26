# NeonSpin Analytics — iGaming & Casino Operator Dashboard

A premium, interactive real-time analytics console built with **React** and **Vite**, designed for casino operators and compliance managers. The dashboard features live transaction ledgers, performance stats, a real-time bet ticker, comprehensive game matrix searches, and interactive fraud/compliance alert centers.

🚀 **Live Site URL**: [https://lelyaler.github.io/project1/](https://lelyaler.github.io/project1/)

---

## ✨ Features

### 📊 Real-Time Operations Console
- **KPI Metrics Grid**: Track Gross Gaming Revenue (GGR), Net Gaming Revenue (NGR), Online Player count, and Security Alerts with growth indicator badges.
- **Dynamic Charting**: Interactive area charts comparing GGR vs. NGR over time and platform distribution metrics, built using **Recharts**.
- **Live Bet Ticker**: A simulated real-time feed that displays live player bets, win multipliers, and returns with fluid UI animations.

### 🎮 Games Performance Matrix
- Live games catalog (slots, table, live casino, crash vertical) with stats like Theoretical RTP, Total Spins, and Accumulated Revenue.
- Full text search and category filtering.
- Performance Profile Drawer: Clicking a game loads detailed data sheets and variance metrics.

### 🛡️ Compliance & Fraud alert center
- Case management table to review high/medium risk flags.
- Action items allowing compliance officers to **Approve & Dismiss Case** or **Suspend Account**.
- Custom Interactive Audit Modal with detailed user activity log, login timestamps, proxy detection triggers, and stake anomaly details.

### 💸 Financial Ledger (Finance)
- Detailed logs of deposits and withdrawals filterable by transaction type and status.
- Instant search by Transaction ID or Player Name.
- Interactive report compilation: Triggers a mock download process with a visual progress bar and desktop alerts upon assembly.

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
│   ├── DashboardView.jsx      # KPI statistics, Recharts graphs, and live bet feed
│   ├── GamesView.jsx          # Searchable game catalog table and detail inspector drawer
│   ├── FraudView.jsx          # Flagged accounts, status toggles, and detail audit logs modal
│   ├── TransactionsView.jsx   # Ledger logs and interactive CSV exporter
│   ├── Sidebar.jsx            # Left shell navigation and API gateway monitor
│   └── Header.jsx             # Top bar, active players counter, and admin avatar
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
   git clone https://github.com/Lelyaler/project1.git
   cd project1
   ```

2. **Install all package dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173/project1/](http://localhost:5173/project1/) in your web browser.
