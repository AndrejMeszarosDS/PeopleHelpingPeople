import React, { Component } from "react";

export default class Map extends Component {
  render() {
    return (
      <div className="Map">
        {this.props.logged_in ? <h1>Logged_in</h1> : <div className="fill" />}
      </div>
    );
  }
}
