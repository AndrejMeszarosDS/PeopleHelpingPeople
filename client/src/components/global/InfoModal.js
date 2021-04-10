import React, { Component } from "react";
import { Button, Header, Modal, Message, Grid } from "semantic-ui-react";

export default class InfoForm extends Component {
  componentDidMount = () => {
    setTimeout(() => {
      this.props.closeInfoForm();
    }, 5000);
  };

  render() {
    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          Information
        </Header>
        <Modal.Content className="modalContent">
          <Message positive>
            <Message.Header>{this.props.textInfoForm}</Message.Header>
          </Message>
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <Grid>
            <Grid.Column textAlign="center">
              <Button positive onClick={this.props.closeInfoForm}>
                Close
              </Button>{" "}
            </Grid.Column>
          </Grid>
        </Modal.Actions>
      </Modal>
    );
  }
}
