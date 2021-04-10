import React, { Component } from "react";
import { Menu, Image, Icon } from "semantic-ui-react";
import sidebar from "./icons/sidemenu.png";

export default class MySidebar extends Component {
  render() {
    var visibility = "hide";

    if (this.props.showSideBar) {
      visibility = "show";
    }

    let menuItems = [];
    if (this.props.loggedInUser.Id === 0) {
      menuItems = this.props.loggedOutItems;
    } else {
      menuItems = this.props.loggedInItems;
    }

    return (
      <div
        id="flyoutMenu"
        onMouseDown={this.props.handleMouseDown}
        className={visibility}
      >
        <Image src={sidebar} />
        <Menu fluid vertical size="huge">
          {menuItems.map((item, index) => (
            <Menu.Item
              id={item.id}
              key={item.key}
              onClick={this.props.menuClick}
            >
              <Icon name={item.icon} />
              {item.content}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    );
  }
}
