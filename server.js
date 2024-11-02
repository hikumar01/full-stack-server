const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.disable("x-powered-by");

app.use(session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false, // Set to true if using HTTPS
		httpOnly: true, // Ensures the cookie is accessible only by the web server
		sameSite: 'strict', // Protects against CSRF attacks by not sending the cookie with cross-site requests
		maxAge: 60 * 1000 // 1 minute in milliseconds
	}
}));

function isChromeToolRequestUrl(url) {
	return (url === '/json/version' || url === '/json/list');
}

app.use((req, res, next) => {
	res.on('finish', () => {
		if (!isChromeToolRequestUrl(req.originalUrl)) {
			console.log(`Request: ${req.method} ${req.originalUrl} -> ${res.statusCode} (${res.statusMessage}) - SID(${req.session.id})`);
			// console.log('Session Data:', req.session);
		}
	});
	next();
});

app.get('/api/count', (req, res) => {
	if (req.session) {
		req.session.views = (req.session.views || 0) + 1;
		const body = {
			views: req.session.views,
			localTimeExpire: new Date(req.session.cookie.expires).toLocaleString()
		};
		res.json(body);
	} else {
		res.send('Session not initialized');
	}
});

app.get('/favicon.ico', (req, res) => {
	res.status(204).end();
	return;
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve the React frontend
app.get('*', (req, res) => {
	if (!isChromeToolRequestUrl(req.originalUrl)) {
		console.log(`* Request: ${req.originalUrl}`);
	}
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Express server running on port http://localhost:${PORT}`);
});
