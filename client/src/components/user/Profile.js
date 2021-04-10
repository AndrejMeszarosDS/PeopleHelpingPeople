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
import Axios from "axios";

export default class Profile extends Component {
  myInput = React.createRef();
  state = {
    first_name: "",
    last_name: "",
    old_password: "",
    password: "",
    password_confirmation: "",
    attachment_file: "",
    attachment_blob: "",
    home_position: {
      lat: 0,
      lng: 0
    },
    first_nameError: false,
    last_nameError: false,
    old_passwordError: false,
    passwordError: false,
    passwordconfirmationError: false,
    attachmentError: false,
    home_positionError: false,
    wrongLogin: false,
    formError: false,

    attachmentFileType: "", // store the image file type from rails blob
    new_attachment_file: "", // if user changes ID card, this stores the new image file for updtae

    divWidth: 0
  };

  // for custom file uploader button
  fileInputRef = React.createRef();

  componentDidMount = () => {
    let newtoken = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "get",
      url: "api/users/" + this.props.loggedInUser.Id,
      //baseURL: "http://localhost:3001/api/",
      headers: { Authorization: newtoken }
    })
      .then(response => {
        //console.log(response);
        this.setState({ first_name: response.data.first_name });
        this.setState({ last_name: response.data.last_name });
        this.setState({ first_name: response.data.first_name });
        this.setState({
          home_position: {
            lat: parseFloat(response.data.lat),
            lng: parseFloat(response.data.lng)
          }
        });
        this.setState({ attachment_blob: response.data.gaID });
        let myblob = String(response.data.gaID);
        if (myblob.substr(myblob.length - 3, 3) === "pdf") {
          this.setState({ attachmentFileType: "pdf" });
        } else {
          this.setState({ attachmentFileType: "jpg" });
        }
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ divWidth: this.myInput.current.offsetWidth });
  };

  handleAttachment = event => {
    this.setState({
      attachment_file: event.target.files[0],
      attachment_blob: URL.createObjectURL(event.target.files[0]),
      new_attachment_file: event.target.files[0]
    });
    if (event.target.files[0].type === "application/pdf") {
      this.setState({ attachmentFileType: "pdf" });
    } else {
      this.setState({ attachmentFileType: "jpg" });
    }
  };

  handleHomePositionChange = position => {
    this.setState({ home_position: position });
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

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

    // old password is empty
    if (this.state.old_password.length === 0) {
      if (
        this.state.password.length > 0 ||
        this.state.password_confirmation.length > 0
      ) {
        this.setState({ old_passwordError: true });
        error = true;
      } else {
        this.setState({ old_passwordError: false });
      }
    } else {
      this.setState({ old_passwordError: false });
    }

    if (
      this.state.password.length > 0 &&
      (this.state.password.length < 6 || this.state.password.length > 10)
    ) {
      this.setState({ passwordError: true });
      error = true;
    } else {
      this.setState({ passwordError: false });
    }

    // old password is NOT empty
    if (this.state.old_password.length > 0) {
      if (this.state.password.length < 6 || this.state.password.length > 10) {
        this.setState({ passwordError: true });
        error = true;
      } else {
        this.setState({ passwordError: false });
      }
    }

    if (
      this.state.password.length > 0 &&
      !(this.state.password === this.state.password_confirmation)
    ) {
      this.setState({ passwordconfirmationError: true });
      error = true;
    } else {
      this.setState({ passwordconfirmationError: false });
    }

    if (!this.state.home_position.lat) {
      this.setState({ home_positionError: true });
    } else {
      this.setState({ home_positionError: false });
    }

    const formData = new FormData();
    formData.append("first_name", this.state.first_name);
    formData.append("last_name", this.state.last_name);
    formData.append("password", this.state.password);
    formData.append("old_password", this.state.old_password);
    formData.append("lat", this.state.home_position.lat);
    formData.append("lng", this.state.home_position.lng);
    formData.append("gaID", this.state.new_attachment_file);

    let token = "Bearer " + localStorage.getItem("jwt");

    if (error) {
      this.setState({ formError: true });
    } else {
      this.props.showProcessingForm();
      Axios({
        method: "put",
        url: "api/users/" + this.props.loggedInUser.Id,
        //baseURL: "http://localhost:3001/api/",
        headers: {
          Authorization: token
        },
        data: formData
      })
        .then(response => {
          //console.log(response);
          this.props.closeProcessingForm();
          this.setState({ wrongLogin: false });
          this.props.setInfoFormText("Profile update succesfull.");
          this.props.closeProfileForm();
        })
        .catch(error => {
          this.props.closeProcessingForm();
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
      formErrorContent.push("New password length error !");
    }
    if (this.state.passwordconfirmationError) {
      formErrorContent.push("Passwords not identical !");
    }
    if (this.state.wrongLogin) {
      formErrorContent.push("Current password not valid !");
    }
    if (this.state.attachmentError) {
      formErrorContent.push("ID card not uploaded !");
    }
    if (this.state.home_positionError) {
      formErrorContent.push("Home position not selected !");
    }
    if (this.state.old_passwordError) {
      formErrorContent.push("To create new password enter current password !");
    }

    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          {" "}
          Edit your Profile
        </Header>
        <Modal.Content scrolling>
          {this.state.formError || this.state.wrongLogin ? (
            <Message error header="Error" list={formErrorContent} />
          ) : null}

          <Form unstackable size="large">
            <Segment>
              <Header className="my-sub-header" as="h5" textAlign="left">
                EDIT USER NAME
              </Header>
              <Form.Field>
                <label>
                  First name
                  <span className="label-detail"> ( min 3, max 20 chars )</span>
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
                  <span className="label-detail"> ( min 3, max 20 chars )</span>
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
              </Form.Field>{" "}
            </Segment>
            <Segment>
              <Header as="h5" textAlign="left">
                CHANGE YOUR PASSWORD
              </Header>
              <Form.Input
                label="Current password"
                name="old_password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Old password"
                type="password"
                autoComplete="old-password"
                onChange={this.handleChange}
                // error={this.state.passwordError}
              />
              <Form.Field>
                <label>
                  New password
                  <span className="label-detail"> ( min 6, max 10 chars )</span>
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
                  <span className="label-detail"> ( min 6, max 10 chars )</span>
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
              </Form.Field>{" "}
            </Segment>
            <Segment>
              <Header as="h5" textAlign="left">
                CHANGE YOUR GOVERNMENT-APPROVED ID CARD
              </Header>
              <div ref={this.myInput}>
                {this.state.attachment_blob === null ? (
                  <div />
                ) : this.state.attachmentFileType === "pdf" ? (
                  <PDFReader
                    url={this.state.attachment_blob}
                    width={canvas_width}
                  />
                ) : (
                  <img alt="id" src={this.state.attachment_blob} width="100%" />
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
                  hidden
                  type="file"
                  accept=".pdf, .jpg, .png"
                  onChange={this.handleAttachment}
                />
              </div>
            </Segment>
            <Segment>
              <Header as="h5" textAlign="left">
                CLICK TO CHANGE YOUR HOME LOCATION
              </Header>
              <div className="mapSelectHome-box">
                <div className="mapSelectHome-content">
                  <MapSelectHome
                    homePosition={this.state.home_position}
                    changePosition={this.handleHomePositionChange}
                    editType={true}
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
          <Segment>
            <Header as="h5" textAlign="left">
              DELETE MY ACCOUT
            </Header>
            <Button
              negative
              fluid
              content="Delete my account"
              onClick={this.props.showDeleteUserForm}
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group widths="2">
            <Button positive onClick={this.handleSubmit}>
              Save
            </Button>
            <Button.Or />
            <Button onClick={this.props.closeProfileForm}>Close</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
