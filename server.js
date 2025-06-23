const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable detailed request logging
app.use(morgan(':date[iso] :remote-addr :method :url :status :response-time ms'));

// Log startup
console.log(`🚀 WARLAB Persistent Storage Booting...`);
console.log(`🗂️  Serving static files from: ${__dirname}`);

// Serve static folders
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
  console.log(`[INFO] Root route hit by ${req.ip}`);
  res.send('🌐 WARLAB Persistent Storage is running.');
});

// Healthcheck route (optional)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Fallback for 404s
app.use((req, res, next) => {
  const msg = `[WARN] 404 Not Found: ${req.method} ${req.originalUrl} from ${req.ip}`;
  console.warn(msg);
  res.status(404).json({ error: "File not found", path: req.originalUrl });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ WARLAB Storage is live at: http://localhost:${PORT}`);
});
