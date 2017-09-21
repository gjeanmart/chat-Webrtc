import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class MessageList extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            messages: []
        }
    }
    
    addMessage(message) {
        var messages = this.state.messages;
        var container = this.refs.messageContainer;
        messages.push(message);
        this.setState({ messages: messages });
        // Smart scrolling - when the user is
        // scrolled a little we don't want to return him back
        if (container.scrollHeight - (container.scrollTop + container.offsetHeight) >= 50) {
            this.scrolled = true;
        } else {
            this.scrolled = false;
        }
    }

    componentDidUpdate() {
        if (this.scrolled) {
            return;
        }

        var container = this.refs.messageContainer;
        container.scrollTop = container.scrollHeight;
    }
    
    render() {
        var messages;
        messages = this.state.messages.map(function (m) {
            return (
                <ChatMessage message={m}></ChatMessage>
            );
        });
        if (!messages.length) {
            messages = <div className="chat-no-messages">No messages</div>;
        }
        return (
            <div ref="messageContainer" className="chat-messages col-xs-9">
                {messages}
            </div>
        );
    }
}

export default MessageList;