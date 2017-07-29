import React, { Component } from 'react';
import request from 'superagent';
import io from 'socket.io-client';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      users: [],
    };
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
        this.setState({ user: res.body });
      });
    request.get('/api/users')
      .then(res => {
        this.setState({ users: res.body });
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

        {this.state.users &&
          this.state.users.map(user => {
            if (user.id !== this.state.user.id) {
              const userInfo = (
                <p
                  key={user.id}
                  onClick={() => {this.props.history.push(`/messages/${user.id}`);}}
                  >{user.username}
                </p>
              );
              return userInfo;
            }
          })
        }
      </div>
    );
  }
}
