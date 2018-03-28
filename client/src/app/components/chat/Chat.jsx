import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from "socket.io-client";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      messages: []
    };

    this.socket = io('localhost:8080');
    this.socket.on('RECEIVE_MESSAGE', function(data){
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({messages: [...this.state.messages, data]});
    };
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentWillMount() {
    this.user = JSON.parse(localStorage.getItem('user'));
    const name = this.user.firstname + ' ' + this.user.lastname;
    this.setState({username: name});
  }
  sendMessage(e) {
    e.preventDefault();
    this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
    })
    this.setState({message: ''});
  }
  render() {
    return (
      <div className="chat">
        <div className="message-list">
          {this.state.messages.map(message => {
            return (
              <div><span className="author">{message.author}:</span> {message.message}</div>
            )
          })}
        </div>
        <div className="card-footer">
          <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} onKeyPress={ev => {if (ev.key === 'Enter') {this.sendMessage(ev)}}}/>
          <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps)(Chat);