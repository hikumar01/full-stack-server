import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class Count extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popupData: null
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await fetch('/api/count');
            const data = await response.json();
            const date = new Date(data.localTimeExpire);
            const popupData = (
                <div>
                    <div>Views: {data.views}</div>
                    <div>Date: {date.toLocaleDateString()}</div>
                    <div>Time: {date.toLocaleTimeString()}</div>
                </div>
            );
            this.setState({popupData: popupData});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    render() {
        return (
            <div className='rightPopup'>
                {this.state.popupData && this.state.popupData}
            </div>
        );
    }
}

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Count />
        <App />
    </React.StrictMode>
);
