import React, { Component } from 'react';
import request from 'superagent';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      users: [],
      messages: [],
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
      .get(`/api/history/${user}`)
      .then(res => {
        if (res.body !== null) {
          this.setState({ messages: res.body });
        }
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
        {this.state.messages.length > 0 &&
          <h4>Latest Messages</h4>
        }
        {this.state.messages.length > 0 &&
          this.state.messages.map(m => {
            const history = (
              <div className="results" key={m.id}>
                <p
                  onClick={() => {
                    this.props.history.push(`/messages/${m.id}`);
                  }}
                  >{m.username}</p>
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
