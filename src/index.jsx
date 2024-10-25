import React from 'react';
import ReactDOM from 'react-dom/client';

const { useEffect, useState } = React;

function App() {
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetch('/api/message')
			.then((response) => response.json())
			.then((data) => setMessage(data.message))
			.catch((error) => console.error('Error fetching message:', error));
	}, []);

	return (
		<div>
			<h1>My App</h1>
			<p>{message}</p>
		</div>
	);
}

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
