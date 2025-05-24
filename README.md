# 🏥 Patient Registration App

A frontend-only patient registration and SQL query interface built using **React** and **PGlite**. This app runs entirely in the browser — no backend or external database required.

🟢 [Live Demo on Vercel:  ](https://patient-registration-silk.vercel.app/)
   https://patient-registration-silk.vercel.app/
---

## ✨ Features

- Register new patients and persist their data using **PGlite + IndexedDB**
- Run **raw SQL queries** directly from the UI
- Ensure **data persists** across page reloads
- Enable **cross-tab synchronization** using the `BroadcastChannel` API
- Built with **Vite + React + PGlite**

---

## 📜 Git Commit History

Each major feature is documented with a clear Git commit:

```
40aba39 Initialize project with Vite + React setup    
dc53067 Set up persistent SQLite database with PGlite and IndexedDB
bb4db85 Add helper methods: initDB, syncQuery, and getPatients for managing patient records
db3f2bd Implement BroadcastChannel in db.js for real-time cross-tab communication
4d83e07 Create PatientForm component to register new patients and submit to PGlite
b0dde9e Integrate broadcast message after patient registration for live updates in other tabs
ba36123 Add form validation, submission state, and UX feedback (alert + button loading)
b1c1bbe Build SQLQuery component to allow running custom SQL commands in-browser
c2655d9 Add textarea and basic UI to display SQL query results as JSON
60ae71a Update App.jsx to manage tab navigation (Register / Query), handle loading & error states
92e6503 Use effect hook to initialize DB, load patients, and subscribe to BroadcastChannel updates
f87e46c Render patient list dynamically and allow retry if loading fails
9960db2 Add CLEAR_ALL support: delete all patients and sync update to other tabs
e5c92b4 Fix WASM loading issue in vite.config.js with assetsInclude
23b0f0f Exclude @electric-sql/pglite from Vite dependency optimization to avoid runtime conflicts
495587f (HEAD -> master) Add README with setup, deployment, commit history, and challenges faced
```

> You can view the full history with:  
> `git log --oneline`

---

## ⚙️ Setup & Usage

### 🔧 Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### 🛠️ Installation

```bash
git clone https://github.com/harikiran1459/patient-registration.git
cd patient-registration
npm install
npm install @electric-sql/pglite
```

### 🚀 Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

> ✅ The app will be live and persist data using IndexedDB in the browser.

---

## 🧠 Challenges Faced

### 🔄 WebAssembly Loading Errors
- PGlite requires the correct WASM file and Vite config.
- I had to update `vite.config.js` to support `.wasm` and avoid dependency optimization:

```js
optimizeDeps: { exclude: ['@electric-sql/pglite'] },
assetsInclude: ['**/*.wasm']
```

### ❌ Query/Exec Confusion
- Accidentally using db.query() instead of db.exec() for CREATE TABLE caused the schema to never persist — but without throwing a visible error.
- Required deep testing to realize the table wasn't being created in some tabs.

### 🔁 Sync Across Tabs
- Getting `BroadcastChannel` to reliably update all open tabs was tricky. It doesn't persist state — only syncs live events. If a tab is opened later, it won’t get prior updates.
- Required careful event handling and `initDB` calls in every tab.

### 🔍 SQL Query Risks in UI
- Letting users run raw SQL could easily break the app or crash the browser tab (e.g., running DROP TABLE).
- Needed basic try/catch around all query execution and feedback to user.

---

## 📁 Tech Stack

- React (via Vite)
- PGlite (SQLite in WebAssembly)
- IndexedDB (for persistence)
- BroadcastChannel (for tab sync)
- Vercel (for Deployment )

---

## 🙋 Author

Made by Harikiran (https://github.com/harikiran1459)
