import React, { Component } from 'react';
import linkState from 'react-link-state';

class MessageInput extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            message: ""
        }

        this.keyHandler = this.keyHandler.bind(this);
    }
    
    keyHandler(event) {
        var msg = this.state.message.trim();
        if (event.keyCode === 13 && msg.length) {
            this.props.messageHandler(msg);
            this.setState({ message: '' });
        }
    }

    render() {
        return (
            <input type="text"
                className = 'form-control'
                placeholder='Enter a message...'
                valueLink={linkState(this, 'message')}
                onKeyUp={this.keyHandler}/>
        );
    }
}

export default MessageInput;