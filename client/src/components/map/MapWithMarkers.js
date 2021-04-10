import React, { Component } from "react";
import { Card, Button, Image } from "semantic-ui-react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import marker_1 from "../icons/marker_1.png";
import marker_2 from "../icons/marker_2.png";
import marker_3 from "../icons/marker_3.png";
import marker_4 from "../icons/marker_4.png";
//import { isNull } from "util";
import Axios from "axios";
import AddRequestForm from "../AddRequest";
import ConversationsForm from "../Conversation";
import SendMessageForm from "../SendMessage";
import LegendImage from "../icons/legend.png";
import Subscriptions from "../Subscriptions";
import NewMessagesForm from "../NewMessagesLabel";
import RequestsCountForm from "../RequestCountLabel";
import VolunteerSettingsForm from "../VolunteerSetting";

const marker = [marker_1, marker_2, marker_3, marker_4];

let requestores = [];
let responders = [];

const MyMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    onZoomChanged={props.handleMapChanged}
    onDragEnd={props.handleMapChanged}
    onBoundsChanged={props.handleMapFullyLoaded}
    defaultCenter={props.center}
    defaultZoom={props.zoom}
  >
    {props.places.length > 0 &&
      props.places.map(place => (
        <Marker
          key={place.id}
          position={{ lat: parseFloat(place.lat), lng: parseFloat(place.lng) }}
          icon={
            marker[
              props.userID === place.user_id ? place.rtype - 1 : place.rtype + 1
            ]
          }
          onClick={() => props.showInfoWindow(place.id)}
        >
          {props.markerIndex === place.id && (
            <InfoWindow onCloseClick={() => props.showInfoWindow(0)}>
              <Card>
                <Card.Content>
                  <Card.Header>
                    {place.user.first_name} {place.user.last_name}
                  </Card.Header>
                  <Card.Meta className="infoWindowMeta">
                    Request number : ({place.id})<br />
                    Request type:{" "}
                    {place.rtype === 1 ? (
                      <span>material needs.</span>
                    ) : (
                      <span>one time task.</span>
                    )}{" "}
                    <br />{" "}
                    {place.fullfilled === true ? (
                      <span>Request fulfilled : YES.</span>
                    ) : (
                      <span>Request fulfilled : NO.</span>
                    )}{" "}
                  </Card.Meta>
                  <Card.Description>
                    <strong>Request description : </strong>
                    {place.description}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  {props.userID !== place.user_id ? (
                    <Button
                      fluid
                      color="green"
                      onClick={() =>
                        props.setActualMarker(
                          place.id,
                          place.user.first_name + " " + place.user.last_name,
                          place.description,
                          place.user.id
                        )
                      }
                    >
                      Send message
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </Card.Content>
              </Card>
            </InfoWindow>
          )}
        </Marker>
      ))}
  </GoogleMap>
));

export class MapWithMarkers extends Component {
  constructor(props) {
    super(props);

    this.xMapBounds = { min: null, max: null };
    this.yMapBounds = { min: null, max: null };

    this.mapFullyLoaded = false;
    this.zoom = 7;

    this.state = {
      places: [],
      lat: props.loggedInUser.Lat,
      lng: props.loggedInUser.Lng,
      markerIndex: 0,
      toggle: false,

      showAddRequestForm: false,
      showConversationsForm: false,
      showSendMessageForm: false,
      showVolunteersForm: false,

      // conversations
      requestores: [],
      responders: [],
      // selected request info
      selectedRequestID: 0,
      selectedRequestCreatorFullName: "",
      selectedRequestDescription: "",
      selectedRequestUserID: 0,
      selectedResponderID: 0,
      selectedConversationID: 0,
      selectedPersonType: 0,
      selectedResponderVolunteer: false,
      // total # of unreaded messages
      unreadedMessageCount: 0,
      // map width
      mapFullWidth: true
    };
  }

  showAddRequestForm = () => this.setState({ showAddRequestForm: true });
  closeAddRequestForm = () => this.setState({ showAddRequestForm: false });
  showConversationsForm = () => this.setState({ showConversationsForm: true });
  closeConversationsForm = () =>
    this.setState({ showConversationsForm: false });
  showSendMessageForm = () => this.setState({ showSendMessageForm: true });
  closeSendMessageForm = () => this.setState({ showSendMessageForm: false });
  showVolunteersForm = () => this.setState({ showVolunteersForm: true });
  closeVolunteersForm = () => this.setState({ showVolunteersForm: false });

  componentDidMount = () => {
    this.getConversations();
  };

  componentDidUpdate() {
    //console.log(this.state.toggle);
  }

  setSelectedResponderVolunteer = state => {
    this.setState({ selectedResponderVolunteer: state });
    //console.log(state);
  };

  getConversations() {
    //console.log("Get conversations");
    //where iam a responder
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/requests",
      params: {
        responderID: this.props.loggedInUser.Id
      },
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        //console.log(response);
        requestores = response.data;

        //this.setState({ requestores: response.data });
        //my responders
        let token = "Bearer " + localStorage.getItem("jwt");
        Axios({
          method: "GET",
          url: "api/responders",
          params: {
            userID: this.props.loggedInUser.Id
          },
          headers: {
            Authorization: token
          }
        })
          .then(response => {
            responders = response.data;
            //this.setState({ responders: response.data });
            this.getUnreadedMessages();
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getUnreadedMessages() {
    let x = 0;
    requestores.forEach(requestor => {
      x = x + requestor.unreaded_message_count;
    });
    responders.forEach(responder => {
      x = x + responder.unreaded_message_count;
    });
    this.setState({ unreadedMessageCount: x });
  }

  toggleToReRender = () => {
    //console.log("render");
    this.setState({ toggle: !this.state.toggle });
    this.getConversations();
    this.handleMapChanged();
  };

  showInfoWindow(actualMarker) {
    this.setState({ markerIndex: actualMarker });
  }

  handleMapChanged = () => {
    this.getMapBounds();
    this.setMapCenterPoint();
    this.fetchPlacesFromApi();
  };

  handleMapMounted(map) {
    this.map = map;
  }

  handleMapFullyLoaded() {
    if (this.mapFullyLoaded) return;
    this.mapFullyLoaded = true;
    this.handleMapChanged();
  }

  setMapCenterPoint() {
    this.setState({
      lat: this.map.getCenter().lat(),
      lng: this.map.getCenter().lng()
    });
  }

  fetchPlacesFromApi() {
    //this.setState({ places: [] });
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/requests",
      params: {
        min_lng: this.yMapBounds.min,
        max_lng: this.yMapBounds.max,
        min_lat: this.xMapBounds.min,
        max_lat: this.xMapBounds.max
      },
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        //console.log(response);
        response.data.forEach(respons => {
          if (
            this.state.places.findIndex(obj => obj.id === respons.id) === -1
          ) {
            this.setState(previousState => ({
              places: [...previousState.places, respons]
            }));
          }
        });
        //console.log(this.state.places);
        this.state.places.forEach(place => {
          let index = response.data.findIndex(obj => obj.id === place.id);
          if (index === -1) {
            let index2 = this.state.places.findIndex(
              obj => obj.id === place.id
            );
            let newArray = this.state.places.slice();
            newArray.splice(index2, 1);
            this.setState({ places: newArray });
          }
        });
      })

      .catch(error => {
        console.log(error);
      });
  }

  getMapBounds() {
    //console.log(this.map.getBounds());
    this.xMapBounds.min = this.map
      .getBounds()
      .getSouthWest()
      .lat();

    this.xMapBounds.max = this.map
      .getBounds()
      .getNorthEast()
      .lat();

    this.yMapBounds.min = this.map
      .getBounds()
      .getSouthWest()
      .lng();

    this.yMapBounds.max = this.map
      .getBounds()
      .getNorthEast()
      .lng();
  }

  // set selected REQUEST data
  setSelectedRequest = (
    ID,
    FullName,
    Description,
    UserID,
    pType,
    ResponderID,
    partnerID,
    volunteer
  ) => {
    this.setState({ selectedRequestID: ID });
    this.setState({ selectedRequestCreatorFullName: FullName });
    this.setState({ selectedRequestDescription: Description });
    this.setState({ selectedRequestUserID: UserID });
    this.setState({ selectedPersonType: pType });
    this.setState({ selectedResponderID: ResponderID });
    this.setState({ selectedConversationPartnerUserID: partnerID });
    this.setState({ selectedResponderVolunteer: volunteer });
  };

  setActualMarker(markerID, fUllName, description, userID) {
    let token = "Bearer " + localStorage.getItem("jwt");
    Axios({
      method: "GET",
      url: "api/responders",
      params: {
        request_id: markerID,
        user_id: this.props.loggedInUser.Id
      },
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        let selResp = 0;
        if (response.data.length === 0) {
          selResp = 0;
        } else {
          selResp = response.data[0].id;
        }
        //console.log(selResp);
        this.setSelectedRequest(
          markerID,
          fUllName,
          description,
          userID,
          1,
          selResp,
          userID
        );
        this.closeSendMessageForm();
        this.showSendMessageForm();
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { lat, lng, places } = this.state;
    var mapWidth = "full";
    if (this.state.showConversationsForm || this.state.showSendMessageForm) {
      mapWidth = "nofull";
    }
    //console.log("MapWithMarkers rendered");
    //console.log(this.xMapBounds);
    return (
      <div id="mapWithMarkers" className={mapWidth}>
        <MyMap
          onMapMounted={this.handleMapMounted.bind(this)}
          handleMapChanged={this.handleMapChanged.bind(this)}
          handleMapFullyLoaded={this.handleMapFullyLoaded.bind(this)}
          center={{
            lat: lat,
            lng: lng
          }}
          places={places}
          zoom={this.zoom}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          markerIndex={this.state.markerIndex}
          showInfoWindow={this.showInfoWindow.bind(this)}
          setActualMarker={this.setActualMarker.bind(this)}
          userID={this.props.loggedInUser.Id}
        />
        {this.state.showAddRequestForm ? (
          <AddRequestForm
            show={this.state.showAddRequestForm}
            closeForm={this.closeAddRequestForm}
            loggedInUser={this.props.loggedInUser}
            setInfoFormText={this.props.setInfoFormText}
            toggleToReRender={this.handleMapChanged}
          />
        ) : (
          <div />
        )}
        {this.state.showConversationsForm ? (
          <ConversationsForm
            closeConversationsForm={this.closeConversationsForm}
            requestores={requestores}
            responders={responders}
            setSelectedRequest={this.setSelectedRequest}
            showSendMessageForm={this.showSendMessageForm}
            closeSendMessageForm={this.closeSendMessageForm}
          />
        ) : (
          <div />
        )}
        {this.state.showSendMessageForm ? (
          <SendMessageForm
            loggedInUser={this.props.loggedInUser}
            selectedRequestID={this.state.selectedRequestID}
            selectedRequestCreatorFullName={
              this.state.selectedRequestCreatorFullName
            }
            selectedRequestDescription={this.state.selectedRequestDescription}
            selectedRequestUserID={this.state.selectedRequestUserID}
            selectedPersonType={this.state.selectedPersonType}
            selectedResponderID={this.state.selectedResponderID}
            selectedConversationPartnerUserID={
              this.state.selectedConversationPartnerUserID
            }
            selectedResponderVolunteer={this.state.selectedResponderVolunteer}
            closeSendMessageForm={this.closeSendMessageForm}
            closeConversationsForm={this.closeConversationsForm}
            sendMessage={this.sendMessage}
            toggleState={this.state.toggle}
            showVolunteersForm={this.showVolunteersForm}
          />
        ) : (
          <div />
        )}
        {this.state.showVolunteersForm ? (
          <VolunteerSettingsForm
            show={this.state.showVolunteersForm}
            selectedRequestID={this.state.selectedRequestID}
            closeVolunteersForm={this.closeVolunteersForm}
            selectedResponderVolunteer={this.state.selectedResponderVolunteer}
            selectedResponderID={this.state.selectedResponderID}
            toggleToReRender={this.toggleToReRender}
            setSelectedResponderVolunteer={this.setSelectedResponderVolunteer}
            closeSendMessageForm={this.closeSendMessageForm}
            showConversationsForm={this.showConversationsForm}
          />
        ) : (
          <div />
        )}
        <Subscriptions
          loggedInUser={this.props.loggedInUser}
          toggleToReRender={this.toggleToReRender}
        />
        <Button
          className="addRequestButton"
          onClick={this.showAddRequestForm}
          circular
          icon="add"
          color="green"
          size="big"
        />
        <Button
          className="conversationButton"
          onClick={() => {
            this.showConversationsForm();
            this.closeSendMessageForm();
          }}
          circular
          icon="conversation"
          color="green"
          size="big"
        />
        <NewMessagesForm
          unreadedMessageCount={this.state.unreadedMessageCount}
        />
        <RequestsCountForm
          loggedInUser={this.props.loggedInUser}
          setInfoFormText={this.props.setInfoFormText}
          toggleToReRender={this.toggleToReRender}
        />
        <Image className="legendImage" src={LegendImage} />
      </div>
    );
  }
}

export default MapWithMarkers;
