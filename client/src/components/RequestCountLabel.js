import React, { Component } from "react";
import { Icon, Label } from "semantic-ui-react";
import Axios from "axios";

export default class RequestsCount extends Component {
  state = {
    requests: 0
  };

  componentDidMount() {
    this.tick();
    this.interval = setInterval(() => this.tick(), 5000);
  }

  tick = () => {
    this.checkRequestToPutBackToMap();
    this.getRequestCount();
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkRequestToPutBackToMap = () => {
    //console.log("check back to map");
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/requests",
      params: {
        userID: this.props.loggedInUser.Id
      },
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        if (!(response.data.length === 0)) {
          let start = new Date(response.data[0].updated_at);
          //console.log("start : ", start);
          let end = new Date();
          //console.log("end : ", end);
          //let offsetInMin = end.getTimezoneOffset();
          //console.log("offsetInMin : ", offsetInMin);
          //let offsetInMil = offsetInMin * 1000 * 60;
          //console.log("offsetInMil : ", offsetInMil);

          let diff = end.getTime() - start.getTime();
          //let diffDays = diff >= 1000 * 60 * 60 * 24;
          let diffSec = diff / 1000;
          //console.log("diffInSec : ", diffSec);
          if (diffSec > 5) {
            this.props.setInfoFormText(
              "Your request #" + response.data[0].id + " is back on the map."
            );
            const formData = new FormData();
            formData.append("fullfilled", false);
            formData.append("showOnMap", true);
            Axios({
              method: "put",
              url: "api/requests/" + response.data[0].id,
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
            this.props.toggleToReRender();
            //console.log("Request put back");
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getRequestCount = () => {
    //console.log("tick");
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/requests",
      params: {
        unfullfilled: false
      },
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        this.setState({ requests: response.data.length });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <Label className="requestCount" size="big" color="green">
        <Icon name="handshake outline" />
        {this.state.requests}
      </Label>
    );
  }
}
