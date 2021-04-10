import React, { Component } from "react";
import { Button, Header, Modal, Segment } from "semantic-ui-react";
import Axios from "axios";

export default class VolunteerSetting extends Component {
  state = {
    volunteerCount: 4
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/responders",
      params: {
        volunteer: true,
        request_id: this.props.selectedRequestID
      },
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        //console.log(response.data.length);
        this.setState({ volunteerCount: response.data.length });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleStateChange = () => {
    const formData = new FormData();
    formData.append("state", !this.props.selectedResponderVolunteer);
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "put",
      url: "api/responders/" + this.props.selectedResponderID,
      headers: {
        Authorization: token
      },
      data: formData
    })
      .then(response => {
        //console.log(this.props.selectedResponderVolunteer);
        //this.props.toggleToReRender();
        this.props.setSelectedResponderVolunteer(
          !this.props.selectedResponderVolunteer
        );
        // set the request status if needed !!!
        // when volunteer state is TRUE, we go to remove
        this.props.closeVolunteersForm();
        this.props.closeSendMessageForm();
        this.props.showConversationsForm();
        //console.log("change request status");
        if (!this.props.selectedResponderVolunteer) {
          // when we remove the 5. volunterr
          if (this.state.volunteerCount === 5) {
            //console.log("reqguest unfullfilled");
            // set request as unfullfilled and showOnMap false and set putBackToMap to datetime
            const formData = new FormData();
            formData.append("fullfilled", false);
            formData.append("showOnMap", false);
            let token = "Bearer " + localStorage.getItem("jwt");
            Axios({
              method: "put",
              url: "api/requests/" + this.props.selectedRequestID,
              headers: {
                Authorization: token
              },
              data: formData
            })
              .then(response => {
                //console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          // we add 5. volunterr
          if (this.state.volunteerCount === 4) {
            //console.log("reqguest fullfilled");
            // set request as fullfilled and showOnMap true and set putBackToMap to datetime
            const formData = new FormData();
            formData.append("fullfilled", true);
            formData.append("showOnMap", false);
            let token = "Bearer " + localStorage.getItem("jwt");
            Axios({
              method: "put",
              url: "api/requests/" + this.props.selectedRequestID,
              headers: {
                Authorization: token
              },
              data: formData
            })
              .then(response => {
                //console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
        this.props.toggleToReRender();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    // set text for this modal
    let headerText = "";
    let contentText = "";
    let contentText2 = "";
    // when volunteer state is TRUE, we go to remove
    if (this.props.selectedResponderVolunteer) {
      // when we remove the 5. volunterr
      if (this.state.volunteerCount === 5) {
        headerText = "Warning, Your request will status will be changed !";
        contentText =
          "Your request will be unfullfilled but not shown in the map. After 24 hours Your request will be shown on the map again, when Yoa are loggend in at this time.";
        contentText2 = "Are You sure to change Your request status ?";
      } else {
        headerText = "Warning, You are to remove this volunteer !";
        contentText =
          "You need to have 5 volunteers to set Your request as fulfilled. When Your request has 5 volunteers, it is not showed on the map.";
        contentText2 = "Are You sure to remove this volunteer ?";
      }
    } else {
      if (this.state.volunteerCount < 4) {
        headerText = "Warning, You are to set this responder as volunteer !";
        contentText =
          "You need to have 5 volunteers to set Your request as fulfilled. When Your request has 5 volunteers, it is not showed on the map.";
        contentText2 = "Are You sure ?";
      } else {
        headerText = "Warning, Your request will status will be changed !";
        contentText =
          "Your reguest status will be fullfilled and not shown on the map.";
        contentText2 = "Are You sure to change Your request status ?";
      }
    }

    return (
      <div>
        <Modal open={this.props.show} size="tiny">
          <Header as="h3" textAlign="center" className="modalHeader">
            {headerText}
          </Header>
          <Modal.Content>
            <Segment className="modalContent">
              <p>{contentText}</p>
              <p>{contentText2}</p>
            </Segment>
          </Modal.Content>
          <Modal.Actions className="modalActions">
            <Button.Group widths="2">
              <Button positive onClick={this.handleStateChange}>
                Yes
              </Button>
              <Button.Or />
              <Button onClick={this.props.closeVolunteersForm}>No</Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>{" "}
      </div>
    );
  }
}
