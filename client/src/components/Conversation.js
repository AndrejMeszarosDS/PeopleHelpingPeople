import React, { Component } from "react";
import { Divider, Segment, List, Image, Grid, Button } from "semantic-ui-react";
import userAvatar_1 from "./icons/user_1.png";
import userAvatar_2 from "./icons/user_2.png";
import userAvatar_3 from "./icons/user_3.png";

export default class Conversations extends Component {
  state = {
    toggle: false
  };

  componentDidMount() {
    //this.fetchData();
    this.props.closeSendMessageForm();
  }

  componentDidUpdate() {
    //this.props.closeSendMessageForm();
  }

  showConversation(
    markerID,
    fUllName,
    description,
    userID,
    pType,
    responderID,
    partnerID,
    volunteer
  ) {
    this.props.showSendMessageForm();
    this.props.setSelectedRequest(
      markerID,
      fUllName,
      description,
      userID,
      pType,
      responderID,
      partnerID,
      volunteer
    );
    //console.log(partnerID);
    this.props.closeConversationsForm();
  }

  render() {
    return (
      <div className="conversations">
        <div className="conversations-header">
          <Grid>
            <Grid.Column width={13} style={{ paddingRight: "7px" }}>
              <Segment textAlign="center">
                <b>My conversations</b>
              </Segment>
            </Grid.Column>
            <Grid.Column width={3} style={{ paddingLeft: "7px" }}>
              <Button
                circular
                icon="delete"
                size="big"
                color="red"
                onClick={() => this.props.closeConversationsForm()}
              />
            </Grid.Column>
          </Grid>
        </div>
        <div className="conversations-header">
          <Divider horizontal>Where iam a responder</Divider>
        </div>

        <div className="conversations-content">
          <Segment style={{ height: "100%" }}>
            <List animated divided verticalAlign="middle">
              {this.props.requestores.length > 0 &&
                this.props.requestores.map(requestor => (
                  <List.Item
                    key={requestor.request_id}
                    onClick={() => {
                      this.showConversation(
                        requestor.request_id,
                        requestor.first_name + " " + requestor.last_name,
                        requestor.description,
                        requestor.request_user_id,
                        1,
                        requestor.responder_id,
                        requestor.request_user_id,
                        false
                      );
                    }}
                  >
                    <Image avatar src={userAvatar_1} />
                    <List.Content>
                      <List.Header as="a">
                        <h3>
                          {requestor.first_name} {requestor.last_name} :
                        </h3>
                      </List.Header>
                      <List.Description as="a">
                        Reguest#(
                        {requestor.request_id}) Unreaded messages : (
                        {requestor.unreaded_message_count < 1 ? (
                          <span>{requestor.unreaded_message_count}</span>
                        ) : (
                          <b>{requestor.unreaded_message_count}</b>
                        )}
                        )
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
            </List>
          </Segment>
        </div>
        <div className="conversations-header">
          <Divider horizontal>Responders for my requests</Divider>
        </div>
        <div className="conversations-content">
          <Segment style={{ height: "100%" }}>
            <List animated divided verticalAlign="middle">
              {this.props.responders.length > 0 &&
                this.props.responders.map(responder => (
                  <List.Item
                    key={responder.responder_id}
                    onClick={() => {
                      this.showConversation(
                        responder.request_id,
                        responder.first_name + " " + responder.last_name,
                        responder.description,
                        this.props.currentUserID,
                        2,
                        responder.responder_id,
                        responder.responder_user_id,
                        responder.volunteer
                      );
                    }}
                  >
                    {responder.volunteer ? (
                      <Image avatar src={userAvatar_3} />
                    ) : (
                      <Image avatar src={userAvatar_2} />
                    )}

                    <List.Content>
                      <List.Header as="a">
                        <h3>
                          {responder.first_name} {responder.last_name}
                        </h3>
                      </List.Header>
                      <List.Description as="a">
                        Reguest#({responder.request_id}) -
                        {responder.fullfilled ? (
                          <b>Fullfilled</b>
                        ) : (
                          <span>Unfullfilled</span>
                        )}
                        <br />
                        Unreaded messages : (
                        {responder.unreaded_message_count < 1 ? (
                          <span>{responder.unreaded_message_count}</span>
                        ) : (
                          <b>{responder.unreaded_message_count}</b>
                        )}
                        )
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
            </List>
          </Segment>
        </div>
      </div>
    );
  }
}
