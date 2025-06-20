const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5173;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
