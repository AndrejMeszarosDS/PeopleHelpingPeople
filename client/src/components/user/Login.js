import React, { Component } from "react";
import {
  Button,
  Header,
  Modal,
  Form,
  Message,
  Segment
} from "semantic-ui-react";
import Axios from "axios";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    emailError: false,
    emailFormatError: false,
    passwordError: false,
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

    if (this.state.password === "") {
      this.setState({ passwordError: true });
      error = true;
    } else {
      this.setState({ passwordError: false });
    }

    if (!this.checkEmailFormat(this.state.email)) {
      this.setState({ emailFormatError: true });
      error = true;
    } else {
      this.setState({ emailFormatError: false });
    }

    const request = {
      auth: { email: this.state.email, password: this.state.password }
    };

    if (error) {
      this.setState({ formError: true });
    } else {
      Axios({
        method: "post",
        url: "api/user_token",
        //baseURL: "http://localhost:3001/api/",
        data: request
      })
        .then(response => {
          localStorage.setItem("jwt", response.data.jwt);
          this.setState({ wrongLogin: false });
          this.props.setInfoFormText("Login succesfull.");
          this.props.JWT2userId(response.data.jwt);
          this.props.closeLoginForm();
        })
        .catch(error => {
          console.log("error");
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
    if (this.state.passwordError) {
      formErrorContent.push("Password can't be blank !");
    }
    if (this.state.wrongLogin) {
      formErrorContent.push("Email or password is not valid !");
    }

    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          Login
        </Header>
        <Modal.Content className="modalContent">
          {this.state.formError || this.state.wrongLogin ? (
            <Message error header="Error" list={formErrorContent} />
          ) : null}
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment>
              <Form.Input
                label="Email"
                name="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                autoComplete="user name"
                onChange={this.handleChange}
                error={this.state.emailError}
              />
              <Form.Input
                label="Password"
                name="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                onChange={this.handleChange}
                error={this.state.passwordError}
              />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <Button.Group widths="3">
            <Button positive onClick={this.handleSubmit}>
              Login
            </Button>
            <Button.Or />
            <Button onClick={this.props.closeLoginForm}>Cancel</Button>
            <Button.Or />
            <Button color="blue" onClick={this.props.showPswResetForm}>
              Password Reset
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
