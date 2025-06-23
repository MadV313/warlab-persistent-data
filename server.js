const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the entire directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.send('WARLAB Persistent Storage Repo');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
