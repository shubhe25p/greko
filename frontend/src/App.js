import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
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
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Tooltip from '@mui/material/Tooltip';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
  },
}));

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
      <Box sx={{ flexGrow: 1}}>
        <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Greko
          </Typography>
          {currentUser && 
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for friends…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> }
          <Box sx={{ flexGrow: 1 }} />
          {!currentUser && <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography
              variant="h7"
              sx={{ display: { xs: 'none', sm: 'block' }, px: 1, color: 'white', "&:hover": { color: "#99CCFF !important" }  }}
              component={Link}
              to="/login"
              style={{ textDecoration: 'none' }}
            >
                Login
              
            </Typography>
            </Box>}
            {!currentUser && <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography
              variant="h7"
              component={Link}
              to="/register"
              sx={{ display: { xs: 'none', sm: 'block' }, px: 1, color: 'white', "&:hover": { color: "#99CCFF !important" } }}
              style={{ textDecoration: 'none' }}
            >
                Sign up
            </Typography>
          </Box>}
          {currentUser && <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Profile">
          <IconButton size="large" color="inherit" component={Link} to="/user" sx={{ "&:hover": { color: "#FFF !important" } }}>
              
              <AccountBoxIcon />

          </IconButton>
          </Tooltip>
          <Tooltip title="Friends">
            <IconButton size="large" color="inherit" component={Link} to="/friends" sx={{ "&:hover": { color: "#FFF !important" } }}>
              
                <PeopleIcon />

            </IconButton>
            </Tooltip>
            <Tooltip title="Create thing">
            <IconButton
              size="large"
              color="inherit"
              onClick={this.handleDialog}
            >
             
                <AddIcon />
            </IconButton> 
            
            </Tooltip>
            <CreateThing
                    key={new Date().getTime()} 
                    open={this.state.openDialog}
                    OnClose={this.handleDialog}
                />
            {/* <Button variant="contained" onClick={this.handleDialog}><AddIcon /></Button>
                  <CreateThing
                      key={new Date().getTime()} 
                      open={this.state.openDialog}
                      OnClose={this.handleDialog} 
                  /> */}
            <Tooltip title="Logout">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              onClick={this.logOut}
            >
              <LogoutIcon />
            </IconButton>
            </Tooltip>
          </Box>}
        </Toolbar>
        </AppBar>
        <div className="container mt-3">
          <Routes>
            {!currentUser && <Route path="/" element={<SignIn />} /> }
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            {currentUser && <Route path="/" element={<Calendar />} />}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/friends" element={<Friends/>} />
          </Routes>
           
        </div> 
      </Box>
      
    );
  }
}

export default App;
