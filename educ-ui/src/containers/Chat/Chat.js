import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ChatProxy from '../../models/chatProxy';
import ChatBox from './ChatBox';

class Chat extends Component {
    
    constructor(props) {
        super(props);
        this.state = { username: "" };
        this.initChat = this.initChat.bind(this);
    }
    
    updateUsername(evt) {
        this.setState({
            username: evt.target.value
        });
    }
    
    initChat() {
        var proxy = new ChatProxy();
        ReactDOM.render(
            <ChatBox chatProxy={proxy} username={this.state.username}></ChatBox>, 
            document.getElementById('container')
        );
    }
    
    render() {
        return (
            <div>
                <h1>Chat</h1>
                
                <section id="container">
                    <div class="reg-form-container">
                        <label for="username-input">Username</label>
                        <input type="text" value={this.state.username} onChange={evt => this.updateUsername(evt)} />
                        <br />
                        <button id="connect-btn" class="btn btn-primary" onClick={this.initChat.bind(this)}>Connect</button>
                    </div>
                </section>
            </div>
        );
    }
}

export default Chat;