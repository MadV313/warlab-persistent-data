const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Enable detailed request logging
app.use(morgan(':date[iso] :remote-addr :method :url :status :response-time ms'));
app.use(express.json()); // Required for JSON PUT

// Log startup
console.log(`🚀 WARLAB Persistent Storage Booting...`);
console.log(`🗂️  Serving static files from: ${__dirname}`);

// Serve static folders
app.use(express.static(__dirname));

// ─── Root Route ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  console.log(`[INFO] Root route hit by ${req.ip}`);
  res.send('🌐 WARLAB Persistent Storage is running.');
});

// ─── Health Check ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// ─── GET /data/:filename ──────────────────────────────────────────────
app.get('/data/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

// ─── PUT /data/:filename ──────────────────────────────────────────────
app.put('/data/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DATA_DIR, filename);

  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error(`❌ Failed to save ${filename}:`, err);
      return res.status(500).json({ error: 'Save failed' });
    }

    console.log(`✅ [SAVE] ${filename}`);
    res.json({ status: 'success', filename });
  });
});

// ─── 404 Fallback ─────────────────────────────────────────────────────
app.use((req, res, next) => {
  const msg = `[WARN] 404 Not Found: ${req.method} ${req.originalUrl} from ${req.ip}`;
  console.warn(msg);
  res.status(404).json({ error: "File not found", path: req.originalUrl });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ─── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ WARLAB Storage is live at: http://localhost:${PORT}`);
});
