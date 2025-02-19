import './Compare.css';
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

    handleCompareClick = async () => {
        if (this.state.isDivEditable) {
            const div1 = this.inputDiv1Ref.current;
            const div2 = this.inputDiv2Ref.current;
            const body = {str1: div1.getValue(), str2: div2.getValue()};
            console.log('Input:', body);
            try {
                const response = await fetch('/compare', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Output:', data);
                div1.setUpdatedStr(data.result, true);
                div2.setUpdatedStr(data.result, false);
            } catch (error) {
                throw new Error(`Error! : ${error}`);
            }
        }
        this.setState({isDivEditable: !this.state.isDivEditable});
    };

    getButtonText() {
        return this.state.isDivEditable ? 'Compare' : 'Reset';
    }

    handleDivClick = () => {
        this.setState({isDivEditable: !this.state.isDivEditable});
    };

    render() {
        const str1 = 'Enter       1\r\nNew string  \nnew hi hello   ';
        const str2 = 'Enter 2\nNew str11 008.     \nNew hello hi world  ';
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
                        plainStr={str1}
                        id='str1'
                        isDivEditable={this.state.isDivEditable}
                        onDivClick={this.handleDivClick} />
                    <InputDiv
                        ref={this.inputDiv2Ref}
                        plainStr={str2}
                        id='str2'
                        isDivEditable={this.state.isDivEditable}
                        onDivClick={this.handleDivClick} />
                </div>
            </div>
        );
    }
}

export default App;
