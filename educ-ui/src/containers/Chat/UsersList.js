import React, { Component } from 'react';

class UsersList extends Component {
    

  render() {
    var users = this.props.users.map(function (user) {
      return <div className="chat-user">{user}</div>;
    });
    
    return (
      <div className="users-list col-xs-3">
        {users}
      </div>
    );
  }
}

export default UsersList;