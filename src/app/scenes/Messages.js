import React, { Component } from 'react';
import request from 'superagent';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      sendTo: '',
      messages: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.getMessages();
    this.getUser();
  }

  getMessages() {
    request
      .get('/api/messages/' + this.props.location.pathname.split('/').pop())
      .then(res => {
        console.log(res.body);
        this.setState({ sendTo: res.body.username, messages: res.body.messages });
      });
  }

  getUser() {
    request
      .get('/api/user/')
      .then(res => {
        this.setState({ user: res.body.username });
      });
  }

  sendMessage() {
    const message = this.refs.message.value;
    const from = this.state.user;
    const to = this.state.sendTo;

    const pac = { message, from, to };

    request
      .post('/api/messages/' + this.props.location.pathname.split('/').pop())
      .type('form')
      .send(pac)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      });
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
          {this.state.messages.length &&
            this.state.messages.map((m, i) => {
              const color = this.state.user === m.from ? 'green' : 'blue';
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
