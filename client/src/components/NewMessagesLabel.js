import React, { Component } from "react";
import { Icon, Label } from "semantic-ui-react";

export default class NewMessages extends Component {
  render() {
    return (
      <Label className="newMessagesLabel" size="big" color="green">
        <Icon name="mail" />
        {this.props.unreadedMessageCount}
      </Label>
    );
  }
}
