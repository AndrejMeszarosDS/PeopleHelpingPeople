import React, { Fragment } from "react";
import { ActionCableConsumer } from "react-actioncable-provider";

class Subscriptions extends React.Component {
  handleReceivedMessage = response => {
    //console.log(response);
    this.props.toggleToReRender();
  };

  shouldComponentUpdate(nextProps) {
    return !(this.props.loggedInUser.Id === nextProps.loggedInUser.Id);
  }

  render = () => {
    //console.log("subscription");
    return (
      <Fragment>
        <ActionCableConsumer
          channel={{
            channel: "UsersChannel",
            userID: this.props.loggedInUser.Id
          }}
          onReceived={this.handleReceivedMessage}
        />
      </Fragment>
    );
  };
}

export default Subscriptions;
