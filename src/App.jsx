import './App.css';
import InputDiv from './component/InputDiv.jsx';
import React from 'react';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.inputDiv1Ref = React.createRef();
		this.inputDiv2Ref = React.createRef();
		this.state = {
			isDivEditable: true
		};
	}

	handleCompareClick = () => {
		if (this.state.isDivEditable) {
			const input1Value = this.inputDiv1Ref.current.getValue();
			const input2Value = this.inputDiv2Ref.current.getValue();
			console.log('Input 1:', input1Value);
			console.log('Input 2:', input2Value);
		}
		this.setState({ isDivEditable: !this.state.isDivEditable });
	}

	getButtonText() {
		return this.state.isDivEditable ? 'Compare' : 'Reset';
	}

	handleDivClick = (inputValue) => {
		console.log('Div clicked:', inputValue);
		this.setState({ isDivEditable: !this.state.isDivEditable });
	}

	render() {
		return (
			<div className='appContainer'>
				<div className='button-container'>
					<button
						className='compareButton'
						onClick={this.handleCompareClick} >
						{this.getButtonText()}
					</button>
				</div>
				<div className='vertical-container'>
					<InputDiv
						ref={this.inputDiv1Ref}
						inputString="Enter String 1"
						isDivEditable={this.state.isDivEditable}
						onDivClick={this.handleDivClick} />
					<InputDiv
						ref={this.inputDiv2Ref}
						inputString="Enter String 2"
						isDivEditable={this.state.isDivEditable}
						onDivClick={this.handleDivClick} />
				</div>
			</div>
		);
	}
}

export default App;
