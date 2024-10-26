const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.disable("x-powered-by");

function isChromeToolRequests(url) {
	return (url === '/json/version' || url === '/json/list');
}

app.use((req, res, next) => {
	res.on('finish', () => {
		if (!isChromeToolRequests(req.originalUrl)) {
			console.log(`Request: ${req.method} ${req.originalUrl} -> ${res.statusCode} (${res.statusMessage})`);
		}
	});
	next();
});

app.get('/api/message', (req, res) => {
	res.json({ message: 'Hello from Express!' });
});

app.get('/favicon.ico', (req, res) => {
	res.status(204).end();
	return;
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve the React frontend
app.get('*', (req, res) => {
	if (!isChromeToolRequests(req.originalUrl)) {
		console.log(`* Request: ${req.originalUrl}`);
	}
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Express server running on port http://localhost:${PORT}`);
});
