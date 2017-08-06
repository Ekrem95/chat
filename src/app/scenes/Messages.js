import React, { Component } from 'react';
import request from 'superagent';

import io from 'socket.io-client';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendMessage = this.sendMessage.bind(this);
    this.get = this.get.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem('user') === null) {
      this.props.history.push('/login');
      return;
    }

    const user = localStorage.getItem('user');
    this.setState({ user });
    this.get();
  }

  componentDidUpdate() {
    this.connectIO();

    window.scrollTo(0, document.body.scrollHeight);
  }

  getMessages(username) {
    request
      .post('/api/messages/get/' + username)
      .type('form')
      .send({ with: this.state.sendTo })
      .set('Accept', 'application/json')
      .then(res => {
        this.setState({ messages: res.body.messages });
      });
  }

  io() {
    let socket = io.connect('/');

    if (socket !== undefined) {

      socket.on('dist', message => {
        const messages = this.state.messages;
        messages.push(message);
        this.setState({ messages });
      });
      socket.on('id', id => {
        const user = this.state.user;
        if (user !== undefined && user !== null) {
          socket.emit('save id', { user: this.state.user, id });
        }

      });
    }
  }

  connectIO() {
    if (this.state.sendTo && this.state.user && this.state.messages) {
      this.io();
    }
  }

  get() {
    if (this.props.location.state === undefined) {
      request
        .get('/api/messageswith/' + this.props.location.pathname.split('/').pop())
        .then(res => {
          this.setState({ sendTo: res.body.username });
        })
        .catch(err => {
          console.log(err);
        })
        .then(() => {
          const user = localStorage.getItem('user');
          this.getMessages(user);
        });
    } else {
      const state = this.props.location.state;
      this.setState({
        sendTo: state.with,
        messages: state.messages,
      });
      let wait = setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        this.connectIO();
      }, 50);
    }
  }

  sendMessage() {
    const message = this.refs.message.value;
    const from = this.state.user;
    const to = this.state.sendTo;

    const pac = { message, from, to };

    request
      .post('/api/messages/' + this.state.username)
      .type('form')
      .send(pac)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          console.log(err);
        }
      });

    let socket = io.connect('/');

    if (socket !== undefined) {
      socket.emit('message', pac);
    }

    const messages = this.state.messages;
    messages.push(pac);
    this.setState(messages);
  }

  render() {
    return (
      <div className="messagesPage">
        <h1>Messages with {this.state.sendTo}</h1>
        <div className="messages">
          {this.state.messages &&
            this.state.messages.map((m, i) => {
              const color = this.state.user === m.from ? 'from' : 'to';
              const message = (
                <div
                  className={color}
                  key={i}>{m.message}
                </div>
              );
              return message;
            })
          }
          </div>
          <div className="input">
          <textarea
            ref="message"
            ></textarea>
            <button onClick={this.sendMessage}>Send</button>
            </div>
      </div>
    );
  }
}
