const db = require("../models");
const Tag = db.tag;
const User = db.user;
const Thing = db.thing;
const Op = db.Sequelize.Op;

class TimeFrame {
    constructor(start, end) {
        // date objects
        this.start = start;
        this.end = end;
    }

    getDuration() {
        return this.end - this.start;
    }

    // Define the + operator
    static [Symbol.toPrimitive](timeframe, hint) {
        if (hint === "number") {
            return new timeframe(timeframe.start + 1, timeframe.end + 1);
        } else {
            return String(timeframe.start) + " to " + String(timeframe.end);
        }
    }

    // Define the toString() method
    toString() {
        return String(timeframe.start) + " to " + String(timeframe.end);
    }

    isOverlapping(timeFrame) {
        return this.start < timeFrame.end && this.end > timeFrame.start;
    }
}

function getAvailableTimeframes(unavailableTimeframes, availableTimeframes) {
    // Sort the list of unavailable timeframes by start time
    unavailableTimeframes.sort((a, b) => a.start - b.start);

    // Initialize the list of available timeframes
    let available = [];

    // Set the initial start and end times for the available timeframes
    let start = availableTimeframes[0].start;
    let end = availableTimeframes[0].end;

    // Loop through the list of unavailable timeframes
    for (let i = 0; i < unavailableTimeframes.length; i++) {
        // Get the current unavailable time frame
        let unavailable = unavailableTimeframes[i];

        // If the current unavailable time frame starts after the current available time frame ends, add the current available time frame to the list of available timeframes and set the start and end times for the next available time frame
        if (unavailable.start > end) {
            available.push(new TimeFrame(start, end));
            start = unavailable.end;
            end = availableTimeframes[i + 1].end;
        }
        // If the current unavailable time frame ends after the current available time frame ends, set the end time for the current available time frame to the end time of the current unavailable time frame
        else if (unavailable.end > end) {
            end = unavailable.end;
        }
    }

    // Add the final available time frame to the list of available timeframes
    available.push(new TimeFrame(start, end));

    // Return the list of available timeframes
    return available;
}


module.exports =  function algorithm(userList, startDate, endDate, tagName) {
    let tag = Tag.findOne(tagName);
    let tagTimeframe = new TimeFrame(
        new Date(startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            tag.starttime.getHours(),
            tag.starttime.getMinutes()
        ),
        new Date(startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            tag.endtime.getHours(),
            tag.endtime.getMinutes()
        )
    );

    const timeSlots = [];
    while (tagTimeframe.end <= endDate) {
        timeSlots.push(new TimeFrame(tagTimeframe.start, tagTimeframe.end));
        // Add one day
        tagTimeframe += 1;
    }

    const things = userList.map(async (user) => {
        return await User.getThing({
            where: {
                username: user.username,
                starttime: {
                    [Op.lt]: endDate
                },
                endtime: {
                    [Op.gt]: startDate
                }
            },
            attributes: ['starttime', 'endtime', 'tag'],
            joinTableAttributes: []
        });
    }).flat();

    const thingDates = things.map(thing => {
        return new TimeFrame(new Date(thing.starttime), new Date(thing.endtime));
    });

    const availableTimeframes = getAvailableTimeframes(thingDates, timeSlots);

    for (let i = 0; i < availableTimeframes.length; i++) {
        if (availableTimeframes[i].getDuration() >= tagTimeframe.getDuration()) {
            return new TimeFrame(availableTimeframes[i], availableTimeframes[i] + tagTimeframe.getDuration());
        }
    }

    return null;
}