import React, { Component } from "react";
import {
  Button,
  Header,
  Modal,
  Form,
  Segment,
  Message,
  Input
} from "semantic-ui-react";
import MapSelectHome from "../map/MapSelectHome";
import { PDFReader } from "react-read-pdf";
import axios from "axios";

export default class Signup extends Component {
  myInput = React.createRef();
  state = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    attachment_file: null,
    attachment_blob: null,
    home_position: {
      lat: null,
      lng: null
    },
    first_nameError: false,
    last_nameError: false,
    emailError: false,
    emailFormatError: false,
    passwordError: false,
    passwordconfirmationError: false,
    attachmentError: false,
    home_positionError: false,
    wrongLogin: false,
    formError: false,

    divWidth: 0
  };

  // for custom file uploader button
  fileInputRef = React.createRef();

  componentDidMount() {
    this.setState({ divWidth: this.myInput.current.offsetWidth });
  }

  handleAttachment = event => {
    this.setState({
      attachment_file: event.target.files[0],
      attachment_blob: URL.createObjectURL(event.target.files[0])
    });
  };

  handleHomePositionChange = position => {
    this.setState({ home_position: position });
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  checkEmailFormat(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  handleLogin = () => {
    const request = {
      auth: { email: this.state.email, password: this.state.password }
    };
    axios({
      method: "post",
      url: "/api/user_token",
      //baseURL: "http://localhost:3001/api/",
      data: request
    })
      .then(response => {
        console.log(response);
        localStorage.setItem("jwt", response.data.jwt);
        this.props.setInfoFormText("Signup succesfull.");
        this.props.JWT2userId(response.data.jwt);
        this.setState({ wrongLogin: false }, () => {
          this.props.closeSignupForm();
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ wrongLogin: true });
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ formError: false });
    let error = false;

    if (this.state.first_name.length < 3 || this.state.first_name.length > 20) {
      this.setState({ first_nameError: true });
      error = true;
    } else {
      this.setState({ first_nameError: false });
    }
    if (this.state.last_name.length < 3 || this.state.last_name.length > 20) {
      this.setState({ last_nameError: true });
      error = true;
    } else {
      this.setState({ last_nameError: false });
    }
    if (this.state.email.length > 40) {
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
    if (this.state.password.length < 6 || this.state.password.length > 10) {
      this.setState({ passwordError: true });
      error = true;
    } else {
      this.setState({ passwordError: false });
    }
    if (!(this.state.password === this.state.password_confirmation)) {
      this.setState({ passwordconfirmationError: true });
      error = true;
    } else {
      this.setState({ passwordconfirmationError: false });
    }
    if (!this.state.attachment_file) {
      this.setState({ attachmentError: true });
      error = true;
    } else {
      this.setState({ attachmentError: false });
    }
    if (!this.state.home_position.lat) {
      this.setState({ home_positionError: true });
      error = true;
    } else {
      this.setState({ home_positionError: false });
    }

    const formData = new FormData();
    formData.append("[user]first_name", this.state.first_name);
    formData.append("[user]last_name", this.state.last_name);
    formData.append("[user]email", this.state.email);
    formData.append("[user]password", this.state.password);
    formData.append("[user]lat", this.state.home_position.lat);
    formData.append("[user]lng", this.state.home_position.lng);
    formData.append("[user]gaID", this.state.attachment_file);

    if (error) {
      this.setState({ formError: true });
    } else {
      this.props.showProcessingForm();
      axios({
        method: "post",
        url: "api/users",
        data: formData
      })
        .then(response => {
          console.log(response);
          this.setState({ wrongLogin: false }, () => {
            this.props.closeProcessingForm();
            this.props.setInfoFormText("Login succesfull.");
            this.handleLogin();
          });
        })
        .catch(error => {
          this.props.closeProcessingForm();
          console.log(error);
          this.setState({ wrongLogin: true });
        });
    }
  };

  render() {
    let canvas_width = this.state.divWidth;

    let myHomePosition;
    if (!this.state.home_position.lat) {
      myHomePosition = { lat: "", lng: "" };
    } else {
      myHomePosition = this.state.home_position;
    }

    let formErrorContent = [];
    if (this.state.first_nameError) {
      formErrorContent.push("First name length error !");
    }
    if (this.state.last_nameError) {
      formErrorContent.push("Last name length error !");
    }
    if (this.state.emailError) {
      formErrorContent.push("Email length error !");
    }
    if (this.state.emailFormatError) {
      formErrorContent.push("Email format error !");
    }
    if (this.state.passwordError) {
      formErrorContent.push("Password length error !");
    }
    if (this.state.passwordconfirmationError) {
      formErrorContent.push("Passwords not identical !");
    }
    if (this.state.wrongLogin) {
      formErrorContent.push("Email already in use !");
    }
    if (this.state.attachmentError) {
      formErrorContent.push("ID card not uploaded !");
    }
    if (this.state.home_positionError) {
      formErrorContent.push("Home position not selected !");
    }

    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          {" "}
          Create your Profile
        </Header>
        <Modal.Content className="modalContent" scrolling>
          <div id="scroll">
            {this.state.formError || this.state.wrongLogin ? (
              <Message error header="Error" list={formErrorContent} />
            ) : null}
            <Form unstackable size="large">
              <Segment>
                <Header className="my-sub-header" as="h5" textAlign="left">
                  ENTER USER NAME
                </Header>
                <Form.Field>
                  <label>
                    First name
                    <span className="label-detail">
                      {" "}
                      ( min 3, max 20 chars )
                    </span>
                  </label>
                  <Input
                    name="first_name"
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="First name"
                    onChange={this.handleChange}
                    autoComplete="first-name"
                    error={this.state.first_nameError}
                    value={this.state.first_name}
                  />
                </Form.Field>

                <Form.Field>
                  <label>
                    Last name
                    <span className="label-detail">
                      {" "}
                      ( min 3, max 20 chars )
                    </span>
                  </label>
                  <Input
                    name="last_name"
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Last name"
                    onChange={this.handleChange}
                    autoComplete="last-name"
                    error={this.state.last_nameError}
                    value={this.state.last_name}
                  />
                </Form.Field>
              </Segment>
              <Segment>
                <Header className="my-sub-header" as="h5" textAlign="left">
                  ENTER YOUR EMAIL
                </Header>
                <Form.Field>
                  <label>
                    Email
                    <span className="label-detail"> ( max 40 chars )</span>
                  </label>
                  <Input
                    name="email"
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                    onChange={this.handleChange}
                    error={this.state.emailError}
                  />
                </Form.Field>
              </Segment>
              <Segment>
                <Header as="h5" textAlign="left">
                  ENTER YOUR PASSWORD
                </Header>
                <Form.Field>
                  <label>
                    Password
                    <span className="label-detail">
                      {" "}
                      ( min 6, max 10 chars )
                    </span>
                  </label>
                  <Input
                    name="password"
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    onChange={this.handleChange}
                    error={this.state.passwordError}
                  />
                </Form.Field>
                <Form.Field>
                  <label>
                    Password confirmation
                    <span className="label-detail">
                      {" "}
                      ( min 6, max 10 chars )
                    </span>
                  </label>
                  <Input
                    name="password_confirmation"
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password confirmation"
                    type="password"
                    autoComplete="new-password"
                    onChange={this.handleChange}
                    error={this.state.passwordconfirmationError}
                  />
                </Form.Field>
              </Segment>
              <Segment>
                <Header as="h5" textAlign="left">
                  ULOAD YOUR GOVERNMENT-APPROVED ID CARD
                </Header>
                <div ref={this.myInput}>
                  {this.state.attachment_blob === null ? (
                    <div />
                  ) : this.state.attachment_file.type === "application/pdf" ? (
                    <PDFReader
                      url={this.state.attachment_blob}
                      width={canvas_width}
                    />
                  ) : (
                    <img
                      alt="id"
                      src={this.state.attachment_blob}
                      width="100%"
                    />
                  )}
                  <br />
                  <Button
                    positive
                    fluid
                    content="Choose File"
                    onClick={() => this.fileInputRef.current.click()}
                  />
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    accept=".pdf, .jpg, .png"
                    onChange={this.handleAttachment}
                  />
                </div>
              </Segment>
              <Segment>
                <Header as="h5" textAlign="left">
                  CLICK TO SET YOUR HOME LOCATION
                </Header>
                <div className="mapSelectHome-box">
                  <div className="mapSelectHome-content">
                    <MapSelectHome
                      homePosition={this.state.home_position}
                      changePosition={this.handleHomePositionChange}
                    />
                  </div>
                </div>
                <br />
                <Form.Group widths={2}>
                  <Form.Input
                    label="Latitude"
                    name="latitude"
                    fluid
                    icon="home"
                    iconPosition="left"
                    placeholder="Langitude"
                    readOnly
                    value={myHomePosition.lat}
                  />
                  <Form.Input
                    label="Longitude"
                    name="longitude"
                    fluid
                    icon="home"
                    iconPosition="left"
                    placeholder="Longitude"
                    readOnly
                    value={myHomePosition.lng}
                  />
                </Form.Group>
              </Segment>
            </Form>
          </div>
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <Button.Group widths="2">
            <Button positive onClick={this.handleSubmit}>
              Save
            </Button>
            <Button.Or />
            <Button onClick={this.props.closeSignupForm}>Close</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
