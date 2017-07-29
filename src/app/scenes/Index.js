import React, { Component } from 'react';
import request from 'superagent';
import io from 'socket.io-client';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
    this.io = this.io.bind(this);
  }

  componentWillMount() {
    this.getUser();
    this.io();
  }

  getUser() {
    request
      .get('/api/user')
      .then(res => {
        console.log(res.body);
      });
  }

  io() {
    let socket = io.connect('/');
  }

  logout() {
    request
      .post('/logout')
      .type('form')
      .send({
        logout: true,
      })
      .set('Accept', 'application/json')
      .then(res => {
        console.log(res);
        if (res.statusCode === 200) {
          localStorage.removeItem('token');
          window.location.replace('/login');
        }
      });
  }

  render() {
    return (
      <div>
        <h1>Index</h1>
        <p onClick={this.logout}>Logout</p>
      </div>
    );
  }
}
