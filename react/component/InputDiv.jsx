import './InputDiv.css';
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

class InputDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputString: props.inputString
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.inputString !== this.props.inputString) {
            this.setState({inputString: this.props.inputString});
        }
    }

    getValue() {
        return this.state.inputString;
    }

    updatedDivValue() {
        const unsafeHTML = '<span style=\'color: red;\'>' + this.state.inputString + '</span>';
        const safeHTML = DOMPurify.sanitize(unsafeHTML);
        return {__html: safeHTML};
    }

    renderTextArea() {
        return (
            <textarea
                className='inputTextarea'
                id={this.props.id}
                value={this.state.inputString}
                onChange={(event) => this.setState({inputString: event.target.value})} />
        );
    }

    renderDiv() {
        return (
            <div
                className='inputDiv'
                id={this.props.id}
                onClick={() => this.props.onDivClick(this.state.inputString)}
                dangerouslySetInnerHTML={this.updatedDivValue()} />
        );
    }

    render() {
        return (
            this.props.isDivEditable ? this.renderTextArea() : this.renderDiv()
        );
    }
}

InputDiv.propTypes = {
    inputString: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isDivEditable: PropTypes.bool,
    onDivClick: PropTypes.func.isRequired
};

export default InputDiv;
