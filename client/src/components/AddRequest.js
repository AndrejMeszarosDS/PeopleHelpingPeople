import React, { Component } from "react";
import {
  Button,
  Header,
  Modal,
  Form,
  Segment,
  Message,
  Checkbox,
  Grid,
  TextArea
} from "semantic-ui-react";
import MapSelectHome from "./map/MapSelectHome";
import axios from "axios";

export default class AddRequest extends Component {
  state = {
    request_rtype: 0,
    request_description: "",
    request_position: { lat: "", lng: "" },
    error_rtype: false,
    error_description: false,
    error_position: false,
    error_form: false
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleHomePositionChange = position => {
    this.setState({ request_position: position });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ error_form: false });
    let error = false;
    if (this.state.request_rtype === 0) {
      this.setState({ error_rtype: true });
      error = true;
    } else {
      this.setState({ error_rtype: false });
    }
    if (
      this.state.request_description.length < 20 ||
      this.state.request_description.length > 300
    ) {
      this.setState({ error_description: true });
      error = true;
    } else {
      this.setState({ error_description: false });
    }
    if (this.state.request_position.lat === "") {
      this.setState({ error_position: true });
      error = true;
    } else {
      this.setState({ error_position: false });
    }

    const formData = new FormData();
    formData.append("rtype", this.state.request_rtype);
    formData.append("description", this.state.request_description);
    formData.append("fullfilled", false);
    formData.append("lat", this.state.request_position.lat);
    formData.append("lng", this.state.request_position.lng);
    formData.append("user_id", this.props.loggedInUser.Id);
    formData.append("showOnMap", true);

    if (error) {
      this.setState({ error_form: true });
    } else {
      let token = "Bearer " + localStorage.getItem("jwt");
      axios({
        method: "post",
        url: "api/requests",
        headers: {
          Authorization: token
        },
        data: formData
      })
        .then(response => {
          this.props.setInfoFormText("Request created succesfully.");
          this.props.closeForm();
          this.props.toggleToReRender();
          //console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    let formErrorContent = [];
    if (this.state.error_rtype) {
      formErrorContent.push("Request type not selected !");
    }
    if (this.state.error_description) {
      formErrorContent.push(
        "Request description lenght error ! (min. 20, max. 300 char)"
      );
    }
    if (this.state.error_position) {
      formErrorContent.push("Request position not selected !");
    }

    return (
      <Modal open={this.props.show} size="tiny">
        <Header className="modalHeader" as="h3" textAlign="center">
          {" "}
          Create new request
        </Header>
        <Modal.Content scrolling>
          {this.state.error_form || this.state.wrongLogin ? (
            <Message error header="Error" list={formErrorContent} />
          ) : null}
          <Form unstackable size="large">
            <Segment>
              <Header className="my-sub-header" as="h5" textAlign="left">
                REQUEST TYPE :
              </Header>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="Material needs"
                        name="request_rtype"
                        value="1"
                        checked={this.state.request_rtype === "1"}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="One time task"
                        name="request_rtype"
                        value="2"
                        checked={this.state.request_rtype === "2"}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment>
              <Header className="my-sub-header" as="h5" textAlign="left">
                DESCRIPTION :
                <label>
                  <span className="label-detail">
                    {" "}
                    ( min 20, max 300 chars )
                  </span>
                </label>
              </Header>
              <TextArea
                placeholder="Tell us more"
                name="request_description"
                onChange={this.handleChange}
                style={{ minHeight: 100 }}
              />
            </Segment>
            <Segment>
              <Header as="h5" textAlign="left">
                CLICK TO SET REQUEST LOCATION
              </Header>
              <div className="mapSelectHome-box">
                <div className="mapSelectHome-content">
                  <MapSelectHome
                    homePosition={this.state.request_position}
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
                  value={this.state.request_position.lat}
                />
                <Form.Input
                  label="Longitude"
                  name="longitude"
                  fluid
                  icon="home"
                  iconPosition="left"
                  placeholder="Longitude"
                  readOnly
                  value={this.state.request_position.lng}
                />
              </Form.Group>
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group widths="2">
            <Button positive onClick={this.handleSubmit}>
              Save
            </Button>
            <Button.Or />
            <Button onClick={this.props.closeForm}>Close</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
