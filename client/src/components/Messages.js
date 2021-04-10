import React, { Component } from "react";
import Axios from "axios";
import { Comment } from "semantic-ui-react";
import userAvatar_1 from "./icons/user_1.png";
import userAvatar_2 from "./icons/user_2.png";

export default class Messages extends Component {
  state = {
    messages: [],
    toggle: false
  };

  componentDidMount() {
    this.fetchData();
    //console.log("message sfetch data");
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.responderID !== prevProps.responderID ||
      this.props.updateMessages !== prevProps.updateMessages ||
      this.props.toggleState !== prevProps.toggleState
    ) {
      this.fetchData();
      //console.log("messages fetch data");
    }
  }

  fetchData() {
    if (this.props.responderID > 0) {
      let token = "Bearer " + localStorage.getItem("jwt");
      Axios({
        method: "GET",
        url: "api/conversations",
        params: {
          responder_id: this.props.responderID,
          user_id: this.props.loggedInUser.Id,
          partner_id: this.props.selectedConversationPartnerUserID
        },
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          this.setState({ messages: response.data });
          //console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  render() {
    //console.log("Messages rendered");
    return (
      <Comment.Group className="messageList">
        {this.state.messages.length > 0 &&
          this.state.messages.map(message => (
            <div key={message.id}>
              <Comment>
                {message.user_id === this.props.loggedInUser.Id ? (
                  <Comment.Avatar src={userAvatar_1} />
                ) : (
                  <Comment.Avatar src={userAvatar_2} />
                )}
                <Comment.Content>
                  <Comment.Author as="a" style={{ color: "grey" }}>
                    {message.user.first_name} {message.user.last_name}
                  </Comment.Author>
                  <Comment.Metadata>{message.posted_on}</Comment.Metadata>
                  {message.unreaded ? (
                    <Comment.Text>
                      <b>{message.message}</b>
                    </Comment.Text>
                  ) : (
                    <Comment.Text>
                      <h4 style={{ color: "grey" }}>{message.message}</h4>
                    </Comment.Text>
                  )}
                  <br></br>
                </Comment.Content>
              </Comment>
            </div>
          ))}
      </Comment.Group>
    );
  }
}
