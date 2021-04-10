import React, { Component } from "react";
import {
  Button,
  Segment,
  Grid,
  TextArea,
  Tab,
  Container,
  Checkbox,
  GridRow
} from "semantic-ui-react";
import Messages from "./Messages";
import Axios from "axios";

//import { runInThisContext } from "vm";

export default class SendMessage extends Component {
  state = {
    selectedResponderID: 0,
    updateMessages: true,
    messageText: "",
    responderISvolunteer: false
  };

  componentDidMount() {
    //console.log("Send message did mount");
    this.fetchData();
    //this.props.closeConversationsForm();
  }

  componentDidUpdate(prevProps) {
    //console.log("Send Message DidUpdate");
    if (this.props.selectedResponderID !== prevProps.selectedResponderID) {
      this.fetchData();
    }
  }

  fetchData() {
    //console.log("Fetch data");
    this.setState({ selectedResponderID: this.props.selectedResponderID });
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/responders/" + this.props.selectedResponderID,
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        //console.log(response.data === null);
        if (response.data !== null) {
          this.setState({ responderISvolunteer: response.data.volunteer });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  saveMessage() {
    // check if responder exists
    if (this.state.selectedResponderID === 0) {
      //console.log("Create responder");

      // create responder
      const formData = new FormData();
      formData.append("request_id", this.props.selectedRequestID);
      formData.append("user_id", this.props.loggedInUser.Id);
      formData.append("volunteer", false);
      let token = "Bearer " + localStorage.getItem("jwt");
      Axios({
        method: "POST",
        url: "api/responders",
        headers: {
          Authorization: token
        },
        data: formData
      })
        .then(response => {
          // change state
          //console.log(response.data.id);
          this.setState({ selectedResponderID: response.data.id }, () => {
            //console.log("State changed");
            this.saveConverstion();
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.saveConverstion();
    }
  }

  saveConverstion() {
    // create message
    const formData = new FormData();
    formData.append("responder_id", this.state.selectedResponderID);
    formData.append("user_id", this.props.loggedInUser.Id);
    formData.append("message", this.state.messageText);
    formData.append("unreaded", true);
    formData.append("partner_id", this.props.selectedConversationPartnerUserID);
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "POST",
      url: "api/conversations",
      headers: {
        Authorization: token
      },
      data: formData
    })
      .then(response => {
        this.showMessages();
        this.setState({ messageText: "" });
        //this.props.sendMessage(this.props.selectedConversationPartnerUserID);
      })
      .catch(error => {
        console.log(error);
      });
  }

  showMessages() {
    this.setState({ updateMessages: !this.state.updateMessages });
  }

  showMessages2 = (e, { activeIndex }) => {
    if (activeIndex === 0) {
      this.setState({ updateMessages: !this.state.updateMessages });
    }
  };

  render() {
    //console.log("send message render");
    return (
      <div className="sendMessage">
        <div className="sendMessage-header">
          <Grid>
            <Grid.Column width={13} style={{ paddingRight: "7px" }}>
              <Segment textAlign="center">
                {this.props.selectedPersonType === 1 ? (
                  <b>
                    <h4>
                      Requestor :{this.props.selectedRequestCreatorFullName}
                    </h4>
                  </b>
                ) : (
                  <b>
                    <h4>
                      Requestor :{this.props.selectedRequestCreatorFullName}
                      <br />
                      <Checkbox
                        label="Set this responder as volunteer."
                        onChange={this.props.showVolunteersForm}
                        checked={this.props.selectedResponderVolunteer}
                      />
                    </h4>
                  </b>
                )}
              </Segment>
            </Grid.Column>
            <Grid.Column width={3} style={{ paddingLeft: "7px" }}>
              <Button
                circular
                icon="delete"
                size="big"
                color="red"
                onClick={() => this.props.closeSendMessageForm()}
              />
            </Grid.Column>
          </Grid>
        </div>
        <div
          className="sendMessage-content"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Segment style={{ height: "100%" }}>
            <Tab
              onTabChange={this.showMessages2}
              panes={[
                {
                  menuItem: "Conversation",
                  render: () => (
                    <Tab.Pane style={{ height: "calc(100% - 43px)" }}>
                      <Messages
                        responderID={this.state.selectedResponderID}
                        loggedInUser={this.props.loggedInUser}
                        updateMessages={this.state.updateMessages}
                        toggleState={this.props.toggleState}
                        selectedConversationPartnerUserID={
                          this.props.selectedConversationPartnerUserID
                        }
                      />
                    </Tab.Pane>
                  )
                },
                {
                  menuItem: "Request description",
                  render: () => (
                    <Tab.Pane style={{ height: "calc(100% - 43px)" }}>
                      <Container textAlign="justified">
                        {this.props.selectedRequestDescription}
                      </Container>
                    </Tab.Pane>
                  )
                }
              ]}
              style={{ height: "100%" }}
            />
          </Segment>
        </div>
        <div className="sendMessage-footer">
          <Segment>
            <Grid>
              <Grid.Column width={13} style={{ paddingRight: "7px" }}>
                <GridRow>
                  <TextArea
                    rows={3}
                    style={{ width: "100%" }}
                    name="messageText"
                    value={this.state.messageText}
                    onChange={this.handleChange}
                  />
                </GridRow>
                <GridRow>
                  <label>
                    <span className="label-detail"> ( max 200 chars )</span>
                    {this.state.messageText.length > 200 ? (
                      <span className="label-detail">
                        {" "}
                        - too long message !!!
                      </span>
                    ) : (
                      <div />
                    )}
                  </label>
                </GridRow>
              </Grid.Column>
              <Grid.Column width={3} style={{ paddingLeft: "7px" }}>
                <Button
                  circular
                  icon="send"
                  primary
                  onClick={() => this.saveMessage()}
                  disabled={
                    this.state.messageText.length === 0 ||
                    this.state.messageText.length > 200
                  }
                />
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
      </div>
    );
  }
}
