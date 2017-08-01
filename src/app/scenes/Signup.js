import React, { Component } from 'react';
import request from 'superagent';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      msg: '',
    };
    this.signup = this.signup.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem('user') !== null) {
      this.props.history.push('/');
      return;
    }
  }

  signup() {
    const username = this.refs.username.value;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const password2 = this.refs.password2.value;

    const pac = { username, email, password, password2 };

    request
      .post('/signup')
      .type('form')
      .send(pac)
      .set('Accept', 'application/json')
      .then(res => {
        if (res.body.errors) {
          this.setState({ errors: res.body.errors });
        } else if (res.body.err) {
          if (res.body.err.code === 11000) {
            this.setState({ errors: 'this email already taken.' });
          } else {
            this.setState({ errors: res.body.err });
          }
        } else if (res.body.signup === true) {
          this.setState({
              errors: [],
              msg: 'You are signed up and now you can login',
            });
          let timeout = setTimeout(() => {
            this.props.history.push('/login');
          }, 4000);
        }
      });
  }

  render() {
    return (
      <div className="login">
        <button
          className="link"
          onClick={
            () => {
              this.props.history.push('/login');
            }
          }
          >Login</button>
          <h1>Sign up</h1>
          {this.state.errors &&
          this.state.errors.map((error, i) => {
            const msg = <h4
                          key={i}
                          style={{ color: '#d61566' }}
                          >{error.msg}
                        </h4>;
            return msg;
          })
        }
        {this.state.msg &&
              <h4
                style={{ color: '#d61566' }}
                >{this.state.msg}</h4>
        }

          <form>
            <div>
              <label>Username</label>
              <input type="text" placeholder="Username" ref="username" autoFocus/>
            </div>
             <div>
              <label>Email</label>
              <input type="email" placeholder="Email" ref="email" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" placeholder="Password" ref="password" />
            </div>
            <div>
              <label>Confirm Password</label>
              <input type="password" placeholder="Password" ref="password2" />
            </div>
            <button
              type="button"
              onClick={this.signup}
              >Signup</button>
          </form>
      </div>
    );
  }
}
