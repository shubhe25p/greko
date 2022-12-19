import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import {List, ListItem, ListItemText} from '@mui/material'

import { Navigate } from "react-router-dom";

export default function Friends() {
    const currentUser = AuthService.getCurrentUser();
    const [friendsList, setFriendsList] = useState();
    const [requestsList, setRequestsList] = useState();

    useEffect(() => {
        UserService.getFriends().then(res => {
            const friends = res.data;
            const list = friends.map(friend => {
                return (<ListItem key={friend.username}>
                    <ListItemText>{friend.username}</ListItemText>
                </ListItem>);

            });
            setFriendsList(list);
        });
        UserService.getFriendRequests().then(res => {
            const requests = res.data;

            const itemStyles = {
                fontSize: "16px",
                color: "blue"
              };

            const list = requests.map(friend => {
                return (
                    <ListItem style={itemStyles} key={friend.username}>
                        <ListItemText>{friend.username}</ListItemText>
                    </ListItem>
                );

            });
            setRequestsList(list);
        });
    }, []);

    if (!currentUser) {
        return <Navigate to={"/login"} />;
    }

    const styles = {
        border: "1px solid black",
        backgroundColor: "#eee"
      };

    return (
        <div>
            <List style={styles}>
                Friends list: {friendsList}
            </List>
            <List style={styles}>
                Requests list: {requestsList}
            </List>
        </div>
    );
}