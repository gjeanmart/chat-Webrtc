import React, { Component } from 'react';
import MessagesList from './MessagesList';
import UsersList from './UsersList';
import MessageInput from './MessageInput';
import './Chat.css';

class ChatBox extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            users: []
        }
    }
    

    componentDidMount() {
        this.chatProxy = this.props.chatProxy;
        this.chatProxy.connect({username: this.props.username, channel: this.props.channel});
        this.chatProxy.onMessage(this.addMessage.bind(this));
        this.chatProxy.onUserConnected(this.userConnected.bind(this));
        this.chatProxy.onUserDisconnected(this.userDisconnected.bind(this));
    }

    userConnected = (user) => {
        var users = this.state.users;
        users.push(user);
        this.setState({
          users: users
        });
    }

    userDisconnected = (user) => {
        var users = this.state.users;
        users.splice(users.indexOf(user), 1);
        this.setState({
            users: users
        });
    }

    messageHandler = (message) => {
        message = this.refs.messageInput.state.message;
        
        this.addMessage({
            content: message,
            author : this.chatProxy.getUsername()
        });
        this.chatProxy.broadcast(message);
    }

    addMessage = (message) => {
        if (message) {
            message.date = new Date();
            this.refs.messagesList.addMessage(message);
        }
    }
    
    
    render() {
        return (
            <div className="chat-box" ref="root">
                <div className="chat-header ui-widget-header">React p2p Chat</div>
                <div className="chat-content-wrapper row">
                    <MessagesList ref="messagesList"></MessagesList>
                    <UsersList users={this.state.users} ref="usersList"></UsersList>
                </div>
                <MessageInput
                    ref="messageInput"
                    messageHandler={this.messageHandler}>
                </MessageInput>
            </div>
        );
    }
}

export default ChatBox;