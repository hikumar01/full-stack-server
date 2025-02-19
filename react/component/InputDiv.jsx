import './InputDiv.css';
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

class InputDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plainStr: props.plainStr,
            updatedStr: ''
        };
    }

    getValue() {
        return this.state.plainStr;
    }

    applyDiffs(diffs, isBase) {
        const str = this.state.plainStr;

        const result = [];
        let currentIndex = 0;

        diffs.forEach(([operation, word]) => {
            const wordIndex = str.indexOf(word, currentIndex);
            if (wordIndex === -1) {
                return;
            }

            const delimiter = str.slice(currentIndex, wordIndex);
            result.push(delimiter);

            if (operation === 'EQUAL') {
                result.push(word);
            } else if (operation === 'DELETE' && isBase) {
                result.push(word + '-deleted');
            } else if (operation === 'INSERT' && !isBase) {
                result.push(word + '-inserted');
            }

            currentIndex = wordIndex + word.length;
        });

        result.push(str.slice(currentIndex));
        return result.join('');
    }

    setUpdatedStr(result, isBase) {
        const updatedStr = this.applyDiffs(result, isBase);
        console.log('Updated:', updatedStr);
        this.setState({updatedStr});
    }

    updatedDivValue() {
        const unsafeHTML = '<span style=\'color: red;\'>' + this.state.updatedStr + '</span>';
        const safeHTML = DOMPurify.sanitize(unsafeHTML);
        return {__html: safeHTML};
    }

    renderTextArea() {
        return (
            <textarea
                className='inputTextarea'
                id={this.props.id}
                value={this.state.plainStr}
                onChange={(event) => this.setState({plainStr: event.target.value})} />
        );
    }

    renderDiv() {
        return (
            <div
                className='inputDiv'
                onClick={() => this.props.onDivClick()}
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
    plainStr: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isDivEditable: PropTypes.bool,
    onDivClick: PropTypes.func.isRequired
};

export default InputDiv;
