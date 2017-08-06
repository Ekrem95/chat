import React, { Component } from 'react';
import request from 'superagent';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      users: [],
      history: null,
      messages: null,
      lastTimeOnline: null,
      unread: {},
    };
    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem('user') === null) {
      this.props.history.push('/login');
      return;
    }

    this.getUser();

    // window.onbeforeunload = function () {
    //   const user = localStorage.getItem('user');
    //   request
    //     .post('/api/lastTimeOnline/' + user)
    //     .type('form')
    //     .send({ time: Date.now() })
    //     .set('Accept', 'application/json')
    //     .end(err => {
    //       console.log(err);
    //     });
    // };
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

    request
      .get(`/api/all/${user}`)
      .then(res => {
        if (res.body !== null) {
          this.setState({
            history: res.body.history,
            messages: res.body.messages,
            lastTimeOnline: res.body.lastTimeOnline,
          });
        }

        console.log(this.state.lastTimeOnline);

        this.state.messages.map(message => {
          if (message.time > this.state.lastTimeOnline) {
            const unread = Object.assign({}, this.state.unread);
            if (!unread[message.from]) {
              unread[message.from] = 1;
              this.setState({ unread });
            } else {
              unread[message.from] += 1;
              this.setState({ unread });
            }

            console.log(this.state.unread);
          }
        });
      });

    // request.get('/api/users')
    //   .then(res => {
    //     this.setState({ users: res.body });
    //   });
  }

  search() {
    const name = this.refs.search.value;

    if (name.length) {
      request
        .get(`/api/search-users/${name}`)
        .then(res => {
          this.setState({ users: res.body });
        });
    }
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
      <div className="indexPage">
        <h1>Index</h1>
        <p onClick={this.logout}>Logout</p>
        <textarea ref="search"></textarea>
        <button type="button" onClick={this.search}>Search Users</button>

        {this.state.users &&
          this.state.users.map(user => {
            if (user.id !== this.state.userId) {
              const userInfo = (
                <div className="searchResults" key={user.id}>
                <p
                  onClick={() => {
                    const selectedUser = { username: user.username, id: user.id };
                    const messages = this.state.messages;
                    messages[selectedUser.username] = selectedUser.id;
                    this.setState({ messages });

                    request
                      .post(`/api/history/${this.state.user}`)
                      .type('form')
                      .send({ username: user.username, id: user.id })
                      .set('Accept', 'application/json')
                      .end((err) => {
                        if (err) console.log(err);
                      });

                    this.props.history.push(`/messages/${user.id}`);
                  }}
                  >{user.username}
                </p>
                </div>
              );
              return userInfo;
            }
          })
        }
        <div className="latestMessages">
        {this.state.history &&
          <h4>Latest Messages</h4>
        }
        {this.state.history &&
          this.state.history.map(m => {

            const messages = this.state.messages.filter(message => {
              const valid = message.with === m.username;
              return valid;
            });

            const history = (
              <div
                onClick={() => {
                  this.props.history.push(`/messages/${m.id}`, {
                    messages: messages, with: m.username, });
                }}

                className="results" key={m.id}>
                <div>
                  <span className="username">{m.username}</span>
                  <span className="unread">{this.state.unread[m.username]}</span>
                </div>
              </div>
            );
            return history;
          })
        }
        </div>
      </div>
    );
  }
}
