import React, {useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { 
    ViewState, 
    EditingState,
    IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    WeekView,
    MonthView,
    Appointments,
    Toolbar,
    ViewSwitcher,
    DragDropProvider, 
    AppointmentForm,
    AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Navigate } from "react-router-dom";

import UserService from "../services/user.service"
import AuthService from "../services/auth.service"

const currentDate = new Date();
var schedulerData = [
  { startDate: '2022-11-08T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2022-11-09T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];



export default function Calendar() {
    const currentUser = AuthService.getCurrentUser();

    const [data, setData] = useState(schedulerData);

    const refreshData = () => {
        const things = UserService.getUserBoard().then(res => {
            if (res.data.length > 0) {
                var new_data = [];
                res.data.forEach(thing => {
                    const datum = {
                        startDate: thing.starttime,
                        endDate: thing.endtime,
                        title: thing.name,
                        description: thing.description
                    }
                    new_data.push(datum);
                });
                setData(new_data);
            }
        });
    }

    const commitChanges = ({added, changed, deleted}) => {
        if (added) {
            const thing = {
                name: added.title,
                starttime: added.startDate,
                endtime: added.endDate,
            }

            UserService.addThing(thing)
            .catch(err => {
                console.log(err);
            });
            refreshData();
        }
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 1000); // Call refreshData every 1000 milliseconds (1 second)
        return () => clearInterval(interval);
    }, []);
    
    if (!currentUser) {
        return <Navigate to={"/login"} />;
    }

    return (
        <Paper>
            <Scheduler
                data={data}
            >
            <ViewState
                currentDate={currentDate}
                defaultCurrentViewName="Week"
            />
            <EditingState
                onCommitChanges={commitChanges}
            />
            <IntegratedEditing />
            <WeekView
                today={true}
                cellDuration={60}
                startDayHour={7}
                endDayHour={21}
            />
            <DayView
                startDayHour={9}
                endDayHour={19}
            />
            <MonthView />
            <Toolbar />
            <ViewSwitcher />
            <Appointments />
            <AppointmentTooltip
                showOpenButton
                showDeleteButton
            />
            <AppointmentForm />
            </Scheduler>
        </Paper>
    );
}