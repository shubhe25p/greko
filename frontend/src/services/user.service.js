import axios from 'axios';
import authHeader from './auth-header';


const BOARD_EXT = 'home/user';
const ADD_EXT = 'thing/add';
const ADD_FRIENDMAP_EXT = 'thing/createFriendMap'
const LIST_EXT = 'friends/list';
const LIST_REQUEST_EXT = 'friends/listrequests';
const REQUEST_EXT = 'friends/request';
const ACCEPT_FRIENDS_EXT = 'friends/accept';
const SUGGEST_TIME_EXT = '/thing/suggesttime';

class UserService {

  getUserBoard() {
    return axios.get(process.env.REACT_APP_BASE_URL + BOARD_EXT, { headers: authHeader() });
  }

  addThingUserMap(userList){
    return axios.post(process.env.REACT_APP_BASE_URL+ ADD_FRIENDMAP_EXT, userList, {headers: authHeader() });
  }

  addThing(thing) {
    return axios.post(process.env.REACT_APP_BASE_URL + ADD_EXT, thing, { headers: authHeader() });
  }

  getFriends() {
    return axios.get(process.env.REACT_APP_BASE_URL + LIST_EXT, { headers: authHeader() });
  }

  getFriendRequests() {
    return axios.get(process.env.REACT_APP_BASE_URL + LIST_REQUEST_EXT, { headers: authHeader() });
  }

  sendFriendRequest(user) {
    return axios.post(process.env.REACT_APP_BASE_URL + REQUEST_EXT, user, { headers: authHeader() });
  }

  acceptFriendRequest(user) {
    return axios.post(process.env.REACT_APP_BASE_URL + ACCEPT_FRIENDS_EXT, user, { headers: authHeader() });
  }

  // Intelligently suggest a time based on the following:
  // List of usernames (userList), a date range, and a tag
  suggestTime(userList, startDate, endDate, tag) {
    return axios.post(process.env.REACT_APP_BASE_URL + ACCEPT_FRIENDS_EXT, {userList, startDate, endDate, tag}, { headers: authHeader() });
  }
}

export default new UserService();