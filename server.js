const express = require("express");
const path = require("path");

const app = express();
const PORT = 8000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle favicon request 
app.get("/favicon.ico", (req, res) => res.status(204));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


//run node server.js to start on your local host 