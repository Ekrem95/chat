import React, { Component } from 'react';
import request from 'superagent';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      users: [],
    };
    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentWillMount() {
    this.getUser();
  }

  getUser() {
    // request
    //   .get('/api/user')
    //   .then(res => {
    //     // console.log(res.body);
    //     this.setState({ user: res.body });
    //   });
    const user = localStorage.getItem('user');
    const userId = localStorage.getItem('userId');
    this.setState({ user, userId });
    request.get('/api/users')
      .then(res => {
        this.setState({ users: res.body });
      });
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
        // console.log(res);
        if (res.statusCode === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
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
            if (user.id !== this.state.userId) {
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
