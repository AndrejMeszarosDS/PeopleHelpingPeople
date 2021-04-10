import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMap = withGoogleMap(props => (
  <GoogleMap
    defaultCenter={props.center}
    defaultZoom={props.zoom}
    onClick={coord => {
      const { latLng } = coord;
      const lat = latLng.lat();
      const lng = latLng.lng();
      props.changePosition({ lat, lng });
    }}
  >
    {props.home_position.lat ? (
      <Marker title="Home" position={props.home_position} visible={true} />
    ) : null}
  </GoogleMap>
));

export default class MapSelectHome extends Component {
  constructor(props) {
    super(props);

    this.zoom = 7;

    this.state = {
      lat: 50.0515918,
      lng: 19.9357531,

      home_position: this.props.homePosition
    };
  }

  componentDidMount() {
    //console.log(this.props.homePosition);
  }

  render() {
    let center = "";
    let zoom = 0;

    if (this.props.editType) {
      zoom = 15;
    } else {
      zoom = 2;
    }
    if (this.state.home_position.lat) {
      center = this.state.home_position;
      //zoom = 15;
    } else {
      center = {
        lat: 40.854885,
        lng: -88.081807
      };
      zoom = 2;
    }
    return (
      <div style={{ width: `100%`, height: `100%` }}>
        <MyMap
          center={center}
          zoom={zoom}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          changePosition={this.props.changePosition}
          home_position={this.props.homePosition}
        />
      </div>
    );
  }
}
