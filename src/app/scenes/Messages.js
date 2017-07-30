import React, { Component } from 'react';
import request from 'superagent';
import { store } from '../reducer';

import io from 'socket.io-client';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendMessage = this.sendMessage.bind(this);
    this.get = this.get.bind(this);
  }

  componentWillMount() {
    store.subscribe(() => {
        this.setState({ user: store.getState() });
      });

    this.get();

    // this.io();
  }

  componentDidUpdate() {
    if (this.state.sendTo && this.state.user && this.state.messages) {
      this.io();
    }
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
      console.log('Connected');

      socket.on('dist', message => {
        const messages = this.state.messages;
        messages.push(message);
        this.setState({ messages });
        console.log(message);
      });
      socket.on('id', id => {
        const user = this.state.user;
        if (user !== undefined && user !== null) {
          socket.emit('save id', { user: this.state.user, id });
        }

      });
    }
  }

  get() {
    request
      .get('/api/messageswith/' + this.props.location.pathname.split('/').pop())
      .then(res => {
        this.setState({ sendTo: res.body.username });
      })
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        request
          .get('/api/user')
          .then(res => {
            store.dispatch({ type: 'USER', payload: res.body.username });
            this.getMessages(res.body.username);
          });
      });
  }

  sendMessage() {
    const message = this.refs.message.value;
    const from = this.state.user;
    const to = this.state.sendTo;

    const pac = { message, from, to };

    // request
    //   .post('/api/messages/' + this.state.username)
    //   .type('form')
    //   .send(pac)
    //   .set('Accept', 'application/json')
    //   .end(function (err, res) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log(res);
    //     }
    //   });

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
      <div>
        <h1>Messages with {this.state.sendTo}</h1>
        <textarea
          ref="message"
          style={{
            width: '100vw',
            resize: 'none',
            height: 36,
          }}
          ></textarea>
          <button onClick={this.sendMessage}>Send</button>
          {this.state.messages &&
            this.state.messages.map((m, i) => {
              const color = this.state.user === m.from ? 'green' : 'pink';
              const message = (
                <p
                  style={{ background: color }}
                  key={i}>{m.message}
                </p>
              );
              return message;
            })
          }
      </div>
    );
  }
}
