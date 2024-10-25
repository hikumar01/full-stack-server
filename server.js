const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.disable("x-powered-by");

app.use((req, res, next) => {
	res.on('finish', () => {
		console.log('Request URL: ', req.originalUrl, ' -> ', res.statusCode);
	});
	next();
});

app.get('/api/message', (req, res) => {
	res.json({ message: 'Hello from Express!' });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve the React frontend
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Express server running on port http://localhost:${PORT}`);
});
