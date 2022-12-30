import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Button from '@mui/material/Button';
import Register from "./components/register";
import Profile from "./components/profile";
import BoardUser from "./components/board-user";
import SignIn from "./components/SignIn"
import Calendar from "./components/calendar"
import CreateThing from "./components/thing/createThing";
import Friends from "./components/friends"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.handleDialog = this.handleDialog.bind(this);


    this.state = {
      currentUser: undefined,
      openDialog: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  handleDialog(){
    this.setState({
      openDialog: !this.state.openDialog,
    });
  }


  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">

            {currentUser && (
              <li className="nav-item">
                <Link to={"/friends"} className="nav-link">
                  Friends
                </Link>
                
              </li>
              
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">

              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Hello, {currentUser.username}
                </Link>
              </li>

              <li className="nav-item">
                  <Button variant="contained" onClick={this.handleDialog}>Create thing</Button>
                  <CreateThing
                      key={new Date().getTime()} 
                      open={this.state.openDialog}
                      OnClose={this.handleDialog} 
                  />
              </li>
              
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                <Button variant="outlined">LogOut</Button>
                  
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/friends" element={<Friends/>} />
          </Routes>
           
        </div> 
      </div>
    );
  }
}

export default App;
