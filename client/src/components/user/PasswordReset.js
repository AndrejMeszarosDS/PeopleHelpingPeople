import React, { Component } from "react";
import {
  Button,
  Header,
  Modal,
  Form,
  Message,
  Segment
} from "semantic-ui-react";
import axios from "axios";

export default class PasswordReset extends Component {
  state = {
    email: "",
    emailError: false,
    emailFormatError: false,
    wrongLogin: false,
    formError: false
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  checkEmailFormat(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ formError: false });

    let error = false;
    if (this.state.email === "") {
      this.setState({ emailError: true });
      error = true;
    } else {
      this.setState({ emailError: false });
    }
    if (!this.checkEmailFormat(this.state.email)) {
      this.setState({ emailFormatError: true });
      error = true;
    } else {
      this.setState({ emailFormatError: false });
    }

    const formData = new FormData();
    formData.append("email", this.state.email);

    if (error) {
      this.setState({ formError: true });
    } else {
      this.props.showProcessingForm();
      axios({
        method: "post",
        url: "api/password_reset",
        //baseURL: "http://localhost:3001/api/",
        data: formData
      })
        .then(response => {
          this.props.closeProcessingForm();
          this.setState({ wrongLogin: false });
          this.props.setInfoFormText("Email sent with new password.");
          this.props.closePswResetForm();
        })
        .catch(error => {
          this.props.closeProcessingForm();
          this.setState({ wrongLogin: true });
        });
    }
  };

  render() {
    let formErrorContent = [];
    if (this.state.emailError) {
      formErrorContent.push("Email can't be blank !");
    }
    if (this.state.emailFormatError) {
      formErrorContent.push("Wrong email format !");
    }
    if (this.state.wrongLogin) {
      formErrorContent.push("User with this email does not exists !");
    }

    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          Password Reset
        </Header>
        <Modal.Content className="modalContent">
          {this.state.formError || this.state.wrongLogin ? (
            <Message error header="Error" list={formErrorContent} />
          ) : null}
          <Form size="large">
            <Segment>
              <p>Enter Your email and we send to You a new password.</p>
              <Form.Input
                label="Email"
                name="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={this.handleChange}
                error={this.state.emailError}
              />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <Button.Group widths="2">
            <Button positive onClick={this.handleSubmit}>
              Send new password
            </Button>
            <Button.Or />
            <Button onClick={this.props.closePswResetForm}>Cancel</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
