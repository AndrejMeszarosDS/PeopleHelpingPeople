import React, { Component } from "react";
import { Button, Header, Modal, Segment } from "semantic-ui-react";

export default class Logout extends Component {
  handleLogout = () => {
    localStorage.removeItem("jwt");
    this.props.setInfoFormText("Logout succesfull.");
    this.props.JWT2userId("");
    this.props.closeLogoutForm();
  };

  render() {
    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          Logout
        </Header>
        <Modal.Content className="modalContent">
          <Segment>
            <p>Are you sure you want to log out?</p>
          </Segment>
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <Button.Group widths="2">
            <Button positive onClick={this.handleLogout}>
              Yes
            </Button>
            <Button.Or />
            <Button onClick={this.props.closeLogoutForm}>No</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
