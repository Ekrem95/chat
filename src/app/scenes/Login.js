import React, { Component } from 'react';
import request from 'superagent';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
    this.login = this.login.bind(this);
  }

  login() {
    if (this.refs.email.value.length > 1 && this.refs.password.value.length > 1) {

      const email = this.refs.email.value;
      const password = this.refs.password.value;

      const pac = { email, password };

      request
        .post('/login')
        .type('form')
        .send(pac)
        .set('Accept', 'application/json')
        .then(res => {
          if (res.body === null) {
            this.setState({
              error: `Invalid email & password combination.
                      Please try again.`,
            });
          } else {
            localStorage.setItem('token', res.body.token);
            localStorage.setItem('user', res.body.user);
            localStorage.setItem('userId', res.body.userId);
            this.props.history.push('/');
          }
        });
    }
  }

  render() {
    return (
      <div className="login">
        <button
          className="link"
          onClick={
            () => {
              this.props.history.push('/signup');
            }
          }
          >Signup</button>
          <h1>Login</h1>
          { this.state.error && <p>{this.state.error}</p> }
        <form>
          <div>
            <label>Email</label>
            <input type="text"
               ref="email"
                placeholder="Email"
                autoFocus
              />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              ref="password"
              placeholder="Password"
             />
          </div>
          <button type="button" onClick={this.login}>Login</button>
        </form>
      </div>
    );
  }
}
