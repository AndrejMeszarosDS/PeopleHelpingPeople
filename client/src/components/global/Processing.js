import React, { Component } from "react";
import { Message, Icon, Modal } from "semantic-ui-react";

export default class Processing extends Component {
  render() {
    return (
      <Modal open={this.props.show} size="mini">
        <Message compact info icon open={this.props.show}>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are processing your request.
          </Message.Content>
        </Message>
      </Modal>
    );
  }
}
