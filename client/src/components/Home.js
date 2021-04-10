import React, { Component } from "react";
import Axios from "axios";

import Navbar from "./Navbar";

import InfoForm from "./global/InfoModal";
import ProcessingForm from "./global/Processing";

import LoginForm from "./user/Login";
import SignupForm from "./user/Signup";
import PasswordResetForm from "./user/PasswordReset";
import ProfileForm from "./user/Profile";
import LogoutForm from "./user/Logout";
import DeteleUserForm from "./user/Delete";
import HelpForm from "./Help";
import AboutForm from "./About";

import MapWithMarkers from "./map/MapWithMarkers";

import Sidebar from "./Sidebar";

export default class Home extends Component {
  state = {
    //---logged in user data
    loggedInUser: {
      Id: -1,
      FullName: "User full name",
      Lat: 0,
      Lng: 0
    },
    //---user related forms
    showLoginForm: false,
    showSignupForm: false,
    showLogoutForm: false,
    showPswResetFomr: false,
    showProcessingForm: false,
    showProfileForm: false,
    showDeleteUserForm: false,
    showHelpForm: false,
    showAboutpForm: false,
    //---indo from
    showInfoForm: false,
    textInfoForm: "",
    //---sidebar related states
    showSideBar: false
  };

  //---after page is loaded by the browser
  componentWillMount() {
    if (localStorage.getItem("jwt")) {
      this.JWT2userId(localStorage.getItem("jwt"));
    } else {
      this.JWT2userId("");
    }
  }

  //---hadle form show <> close
  closeLoginForm = () => this.setState({ showLoginForm: false });
  closeSignupForm = () => this.setState({ showSignupForm: false });
  closeLogoutForm = () => this.setState({ showLogoutForm: false });
  closeProfileForm = () => this.setState({ showProfileForm: false });
  showPswResetForm = () => this.setState({ showPswResetFomr: true });
  closePswResetForm = () => this.setState({ showPswResetFomr: false });
  showProcessingForm = () => this.setState({ showProcessingForm: true });
  closeProcessingForm = () => this.setState({ showProcessingForm: false });
  showDeleteUserForm = () => this.setState({ showDeleteUserForm: true });
  closeDeleteUserForm = () => this.setState({ showDeleteUserForm: false });
  showHelpForm = () => this.setState({ showHelpForm: true });
  closeHelpForm = () => this.setState({ showHelpForm: false });
  showAboutForm = () => this.setState({ showAboutForm: true });
  closeAboutForm = () => this.setState({ showAboutForm: false });

  showSidebar = () => {
    this.setState({ showSideBar: true });
  };

  toggleSidebar = () => {
    this.setState({ showSideBar: !this.state.showSideBar });
  };
  //---map based form show

  //---info window
  closeInfoForm = () => this.setState({ showInfoForm: false });
  setInfoFormText = text => {
    this.setState({ textInfoForm: text }, () => {
      this.setState({ showInfoForm: true });
    });
  };
  //---set user data from jwt
  JWT2userId = token => {
    let b64DecodeUnicode = str =>
      decodeURIComponent(
        Array.prototype.map
          .call(
            atob(str),
            c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      );
    let parseJwt = token =>
      JSON.parse(
        b64DecodeUnicode(
          token
            .split(".")[1]
            .replace("-", "+")
            .replace("_", "/")
        )
      );
    if (token === "") {
      this.setState({
        loggedInUser: {
          Id: 0,
          FullName: ""
        }
      });
      return;
    }
    let decodedUserId = parseJwt(token).sub;
    let newtoken = "Bearer " + token;
    Axios({
      method: "get",
      url: "api/users/" + decodedUserId,
      //baseURL: "http://localhost:3001/api/",
      headers: { Authorization: newtoken }
    })
      .then(response => {
        //console.log(response);
        if (!(response.data.length === 0)) {
          this.setState({
            loggedInUser: {
              Id: response.data.id,
              FullName:
                response.data.first_name + " " + response.data.last_name,
              Lat: parseFloat(response.data.lat),
              Lng: parseFloat(response.data.lng)
            }
          });
        } else {
          localStorage.removeItem("jwt");
          this.setState({
            loggedInUser: {
              Id: 0,
              FullName: "User full name",
              Lat: 0,
              Lng: 0
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
        localStorage.removeItem("jwt");
        this.setState({
          loggedInUser: {
            Id: 0,
            FullName: "User full name",
            Lat: 0,
            Lng: 0
          }
        });
      });
  };

  //---hadble menu item
  menuItemClicked = event => {
    this.setState({ showSideBar: false });
    switch (event.target.id) {
      case "login":
        this.setState({ showLoginForm: true });
        break;
      case "signup":
        this.setState({ showSignupForm: true });
        break;
      case "logout":
        this.setState({ showLogoutForm: true });
        break;
      case "profile":
        this.setState({ showProfileForm: true });
        break;
      case "help":
        this.setState({ showHelpForm: true });
        break;
      case "about":
        this.setState({ showAboutForm: true });
        break;
      default:
        break;
    }
  };

  render() {
    //let isMobile = window.innerWidth < 580;sd
    //console.log("Home rendered");
    //console.log(this.state.loggedInUser.Id);
    return (
      <div className="home">
        {this.state.loggedInUser.Id >= 0 ? (
          <div className="home">
            <Navbar
              loggedInUser={this.state.loggedInUser}
              loggedInItems={loggedInItems}
              loggedOutItems={loggedOutItems}
              menuClick={this.menuItemClicked}
              showSidebar={this.showSidebar}
              toggleSidebar={this.toggleSidebar}
            />
            {this.state.showInfoForm ? (
              <InfoForm
                show={this.state.showInfoForm}
                closeInfoForm={this.closeInfoForm}
                textInfoForm={this.state.textInfoForm}
              />
            ) : (
              <div />
            )}
            {this.state.showLoginForm ? (
              <LoginForm
                show={this.state.showLoginForm}
                closeLoginForm={this.closeLoginForm}
                setInfoFormText={this.setInfoFormText}
                showPswResetForm={this.showPswResetForm}
                JWT2userId={this.JWT2userId}
              />
            ) : (
              <div />
            )}
            {this.state.showSignupForm ? (
              <SignupForm
                show={this.state.showSignupForm}
                closeSignupForm={this.closeSignupForm}
                setInfoFormText={this.setInfoFormText}
                JWT2userId={this.JWT2userId}
                showProcessingForm={this.showProcessingForm}
                closeProcessingForm={this.closeProcessingForm}
              />
            ) : (
              <div />
            )}

            {this.state.showPswResetFomr ? (
              <PasswordResetForm
                show={this.state.showPswResetFomr}
                closePswResetForm={this.closePswResetForm}
                setInfoFormText={this.setInfoFormText}
                closeLoginForm={this.closeLoginForm}
                showProcessingForm={this.showProcessingForm}
                closeProcessingForm={this.closeProcessingForm}
              />
            ) : (
              <div />
            )}
            {this.state.showProcessingForm ? (
              <ProcessingForm show={this.state.showProcessingForm} />
            ) : (
              <div />
            )}
            {this.state.showProfileForm ? (
              <ProfileForm
                show={this.state.showProfileForm}
                closeProfileForm={this.closeProfileForm}
                loggedInUser={this.state.loggedInUser}
                setInfoFormText={this.setInfoFormText}
                showProcessingForm={this.showProcessingForm}
                closeProcessingForm={this.closeProcessingForm}
                showDeleteUserForm={this.showDeleteUserForm}
              />
            ) : (
              <div />
            )}
            {this.state.showLogoutForm ? (
              <LogoutForm
                show={this.state.showLogoutForm}
                closeLogoutForm={this.closeLogoutForm}
                setInfoFormText={this.setInfoFormText}
                showPswResetForm={this.handleShowPswResetForm}
                JWT2userId={this.JWT2userId}
              />
            ) : (
              <div />
            )}
            {this.state.showDeleteUserForm ? (
              <DeteleUserForm
                show={this.state.showDeleteUserForm}
                closeDeleteUserForm={this.closeDeleteUserForm}
                setInfoFormText={this.setInfoFormText}
                JWT2userId={this.JWT2userId}
                loggedInUser={this.state.loggedInUser}
                closeProfileForm={this.closeProfileForm}
              />
            ) : (
              <div />
            )}
            {this.state.loggedInUser.Id > 0 ? (
              <MapWithMarkers
                loggedInUser={this.state.loggedInUser}
                setInfoFormText={this.setInfoFormText}
              />
            ) : (
              <div className="logged_out_background" />
            )}
            {this.state.showHelpForm ? (
              <HelpForm closeHelpForm={this.closeHelpForm} />
            ) : (
              <div />
            )}
            {this.state.showAboutForm ? (
              <AboutForm closeAboutForm={this.closeAboutForm} />
            ) : (
              <div />
            )}

            <Sidebar
              showSideBar={this.state.showSideBar}
              loggedInUser={this.state.loggedInUser}
              loggedInItems={loggedInItems}
              loggedOutItems={loggedOutItems}
              menuClick={this.menuItemClicked}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const loggedOutItems = [
  {
    id: "about",
    content: "About",
    key: "about",
    icon: "question circle outline"
  },
  { id: "login", content: "Login", key: "login", icon: "sign in" },
  { id: "signup", content: "Signup", key: "signup", icon: "signup" }
];

const loggedInItems = [
  { id: "help", content: "Help", key: "help", icon: "help" },
  { id: "profile", content: "My profile", key: "profile", icon: "user" },
  { id: "logout", content: "Logout", key: "logout", icon: "log out" }
];
