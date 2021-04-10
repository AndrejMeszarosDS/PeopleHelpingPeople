import React, { Component } from "react";
import {
  Button,
  Header,
  Modal,
  Segment,
  Form,
  Message
} from "semantic-ui-react";
import axios from "axios";

export default class Delete extends Component {
  state = {
    password: "",
    passwordError: false,
    wrongLogin: false,
    formError: false
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleDelete = e => {
    e.preventDefault();
    this.setState({ formError: false });

    let error = false;
    if (this.state.password === "") {
      this.setState({ passwordError: true });
      error = true;
    } else {
      this.setState({ passwordError: false });
    }
    const formData = new FormData();
    formData.append("old_password", this.state.password);

    let token = "Bearer " + localStorage.getItem("jwt");

    if (error) {
      this.setState({ formError: true });
    } else {
      axios({
        method: "delete",
        url: "api/users/" + this.props.loggedInUser.Id,
        //baseURL: "http://localhost:3001/api/",
        headers: { Authorization: token },
        data: formData
      })
        .then(response => {
          //console.log(response);
          localStorage.removeItem("jwt");
          this.props.setInfoFormText("Deleting Your account is succesfull.");
          this.props.JWT2userId("");
          this.props.closeProfileForm();
          this.props.closeDeleteUserForm();
        })
        .catch(error => {
          this.setState({ wrongLogin: true });
        });
    }
  };
  //localStorage.removeItem("jwt");
  //this.props.getUserData();
  //this.props.showInfoForm();
  //this.props.closeDeleteUserForm();

  render() {
    let formErrorContent = [];

    if (this.state.passwordError) {
      formErrorContent.push("Password can't be blank !");
    }
    if (this.state.wrongLogin) {
      formErrorContent.push("Password is not valid !");
    }
    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          Delete my accout
        </Header>
        <Modal.Content>
          {this.state.formError || this.state.wrongLogin ? (
            <Message error header="Error" list={formErrorContent} />
          ) : null}

          <Form unstackable size="large">
            <Segment>
              <p>To confirm deleting Your account input Your password.</p>
              <Form.Input
                label="Password"
                name="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                autoComplete="password"
                onChange={this.handleChange}
                //error={this.state.passwordError}
              />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group widths="2">
            <Button negative onClick={this.handleDelete}>
              Delete
            </Button>
            <Button.Or />
            <Button onClick={this.props.closeDeleteUserForm}>No</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
