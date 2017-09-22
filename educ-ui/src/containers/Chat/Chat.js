import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ChatProxy from '../../models/chatProxy';
import ChatBox from './ChatBox';

class Chat extends Component {
    
    constructor(props) {
        super(props);
        this.state = { username: "", channel: "" };
        this.initChat = this.initChat.bind(this);
    }
    
    updateUsername(evt) {
        this.setState({
            username: evt.target.value
        });
    }
    updateChannel(evt) {
        this.setState({
            channel: evt.target.value
        });
    }
    
    initChat() {
        var proxy = new ChatProxy();
        ReactDOM.render(
            <ChatBox chatProxy={proxy} channel={this.state.channel} username={this.state.username}></ChatBox>, 
            document.getElementById('container')
        );
    }
    
    render() {
        return (
            <div>
                <h1>Chat</h1>
                
                <section id="container">
                    
                    <form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" value={this.state.username} onChange={evt => this.updateUsername(evt)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="channel">channel</label>
                            <input type="text" className="form-control" value={this.state.channel} onChange={evt => this.updateChannel(evt)} />
                        </div>
                        <button id="connect-btn" type="submit" className="btn btn-default"onClick={this.initChat.bind(this)}>Connect</button>
                    </form>

                </section>
            </div>
        );
    }
}

export default Chat;