import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Message extends Component {
  render() {
    return (
      <div className="d-flex w-100 justify-content-between">
        <Link to={`/messages/${this.props.item.id}`} className="list-group-item list-group-item-action">
          <blockquote className="blockquote mb-0">
            <p className="text-truncate">
              {this.props.item.message}
              <span className="blockquote-footer">by {this.props.item.user.nick}</span>
            </p>
          </blockquote>
        </Link>
      </div>
    );
  }
}

export default Message;
