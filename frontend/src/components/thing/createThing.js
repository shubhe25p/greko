import React, { useState, Component } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import UserService from "../../services/user.service"
import { FormControl } from "@mui/material";
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

function FriendChip(props) {
  const { onDelete, friend } = props;

  return (
    <Chip label={friend.username} key={friend.username} friend={friend} onDelete={onDelete} />
  );
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function ThingFriendsChips(props) {
  const [thingFriends, setThingFriends] = useState(props.friends);

  const handleDelete = friend => {
    setThingFriends(prevThingFriends => {
      const index = prevThingFriends.indexOf(friend);
      const newThingFriends = [...prevThingFriends];
      newThingFriends.splice(index, 1);
      return newThingFriends;
    });
  }

  return (
    <div>
      {thingFriends.map(friend => {
        return <FriendChip friend={friend} onDelete={handleDelete} />;
      })}
    </div>
  );
}


class CreateThing extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.suggestTime = this.suggestTime.bind(this);

    this.handleFriend = this.handleFriend.bind(this);
    this.state = {
      open: true,
      name: "",
      description: "",
      tag: "",
      startTime: "",
      date: "",
      duration: "",
      location: "",
      friends: [],
      thingFriendList: []
    }
  }

  componentDidMount() {
    UserService.getFriends().then(res => this.state.friends = res.data);
  }
  handleFriend(e) {
    this.setState({
      thingFriendList: e.target.value,
    })
  }
  handleChange(e) {
    if (e.target) {
      this.setState({
        [e.target.name]: e.target.value,

      })
    }
    else {
      this.setState({
        startTime: e.$d,
        date: e.$d
      })
    }
  }

  handleCancel(e) {
    this.props.navigate("/calendar");
  }

  handleSubmit(e) {
    e.preventDefault();
    let endDate = new Date(this.state.date);
    endDate.setHours((endDate.getHours()) + parseInt(this.state.duration));
    const thing = {
      name: this.state.name,
      starttime: this.state.date,
      endtime: endDate,
      description: this.state.description,
      tag: this.state.tag
    }
    let friendList = []
    this.state.thingFriendList.forEach(friend => {
      friendList.push({
        userId: friend.id
      });
    });

    UserService.addThing(thing)
      .then(res => {
        const userList = {
          id: res.data.id,
          friendList: friendList
        };
        console.log(userList);
        this.props.navigate('/calendar');
      })
      .catch(err => {
        console.log(err);
      });
  }

 

  suggestTime(e) {
    this.setState({
      duration: 2,
      startTime: randomDate(new Date(), new Date(2022, 0, 1)),
      date: randomDate(new Date(), new Date(2022, 0, 1)),
    })
    // const userList = this.state.thingFriends.map(friend => friend.username);
    // UserService.suggestTime(userList,this.state.starttime,this.state.endtime,this.state.tag).then(res => {
    //   const suggestion = res.data;
    //   console.log(suggestion);
    //   if (suggestion === "null") {
    //     console.log("No available times");
    //   } else {
    //     this.setState(this.state.date = suggestion.start);
    //   }
    // });
  }

  handleDelete = friend => {
    this.setState(prevState => {
      const index = prevState.thingFriends.findIndex(item => {
        // Compare the username property of the item and friend objects
        return item.username === friend.username;
      });
      const newThingFriends = [...prevState.thingFriends];
      newThingFriends.splice(index, 1);
      return { thingFriends: newThingFriends };
    });
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
      >
        <DialogTitle>
          Create Thing
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={2} sx={{ px: 2 }}>
            <Grid item>
              <Box>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Name"
                  onChange={this.handleChange}
                  value={this.state.name}
                  helperText="Please enter the name of your thing"
                  type="text"
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid item>
              <Box>
                <TextField
                  autoFocus
                  margin="dense"
                  name="tag"
                  onChange={this.handleChange}
                  value={this.state.tag}
                  label="Label/Tag"
                  type="text"
                  variant="outlined"
                />
              </Box>
            </Grid>

          </Grid>
          <Grid sx={{ px: 2 }}>

            <Grid item >
              <Box>
                <TextField
                  autoFocus
                  margin="dense"
                  name="description"
                  label="Description"
                  helperText="Please describe your thing"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.description}
                  fullWidth
                  multiline
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ px: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item>
                <Box>
                  <DesktopDatePicker
                    label="Date"
                    name="date"
                    inputFormat="MM/DD/YYYY"
                    value={this.state.date}
                    onChange={this.handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box>
                  <TimePicker
                    name="startTime"
                    label="Start Time"
                    value={this.state.startTime}
                    onChange={this.handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Grid>
            </LocalizationProvider>
          </Grid>
          <Grid sx={{ p: 2 }}>
            <Grid item>
              <Box>
                <TextField
                  autoFocus
                  margin="dense"
                  name="duration"
                  label="Time duration(in hour)"
                  fullWidth
                  onChange={this.handleChange}
                  value={this.state.duration}
                  type="number"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>

          <Grid sx={{ p: 2 }}>
            <Grid item>
                <FormControl fullWidth>
                <InputLabel id="friend-multiple-chip">Friend List</InputLabel>
                <Select
                  id="friend-multiple-chip"
                  label="Friend List"
                  multiple
                  value={this.state.thingFriendList}
                  onChange={this.handleFriend}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value.id} label={value.username}/>
                      ))}
                    </Box>
                  )}
                >
                  {this.state.friends.map((name) => (
                    <MenuItem
                      key={name.id}
                      value={name}
                    >
                      {name.username}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
            </Grid>
          </Grid>
          <Grid sx={{px:2}}>
          <Button onClick={this.suggestTime} variant="outlined">Time Wizard</Button>
          </Grid>
          
          <DialogActions>
            <Button onClick={this.handleCancel}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
          {/* <ThingFriendsChips 
            friends={this.state.thingFriends}
            handleAdd={this.handleAdd}
            handleDelete={this.handleDelete}
          /> */}
          {/* <FriendsPopover friends={this.state.friends} handleAdd={this.handleAdd}/> */}

        </form>
      </Dialog>
    );
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <CreateThing {...props} navigate={navigate} />
}

export default WithNavigate