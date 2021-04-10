import React, { Component } from "react";
import { Icon, Image, Menu, Responsive } from "semantic-ui-react";

export default class MyNavbar extends Component {
  render() {
    //console.log("Navbar rendered");
    let menuItems = [];
    if (this.props.loggedInUser.Id === 0) {
      menuItems = this.props.loggedOutItems;
    } else {
      menuItems = this.props.loggedInItems;
    }

    return (
      <div className="Navbar">
        <Responsive minWidth={200} maxWidth={768}>
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item>
              <h4>{this.props.loggedInUser.FullName}</h4>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item onClick={this.props.toggleSidebar}>
                <Icon name="sidebar" size="large" />
              </Menu.Item>{" "}
            </Menu.Menu>
          </Menu>
        </Responsive>
        <Responsive minWidth={769}>
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item>PeopleHelpingPeople</Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <h4>{this.props.loggedInUser.FullName}</h4>
              </Menu.Item>
              {menuItems.map((item, index) => (
                <Menu.Item {...item} onClick={this.props.menuClick} />
              ))}
            </Menu.Menu>
          </Menu>
        </Responsive>
      </div>
    );
  }
}
