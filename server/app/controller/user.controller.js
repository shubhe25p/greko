const db = require('../models');
const config = require('../config/auth.config')
const User = db.user;
const Thing = db.thing;
const Op = db.Sequelize.Op;

const { verifyToken } = require('../middleware/authJwt');
const { algorithm } = require('../wizardry/algorithm');

exports.userBoard = (req, res) => {
    verifyToken(req, res, () => {
        Thing.findAll({
            where: {
                createdby: req.userId
            }
        }).then(things => {
            res.status(200).send(things);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    });

};

exports.addThing = (req, res) => {
    verifyToken(req, res, () => {
        Thing.create({
            name: req.body.name,
            starttime: req.body.starttime,
            endtime: req.body.endtime,
            description: req.body.description,
            tag: req.body.tag,
            createdBy: req.userId,
        }).then(thing => {
            res.status(200).send(thing);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    });
}

exports.updateThing = (req, res) => {
    verifyToken(req, res, () => {
        Thing.findOne({
            createdby: req.userId,
            id: req.body.id
        }).then(thing => {
            thing.update({
                name: req.body.name,
                starttime: req.body.starttime,
                endtime: req.body.endtime,
                description: req.body.description
            });
            res.status(200).send(thing);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    });
};

exports.deleteThing = (req, res) => {
    verifyToken(req, res, () => {
        Thing.findOne({
            createdby: req.userId,
            id: req.body.id
        }).then(thing => {
            thing.destroy();
            res.status(200).send({message: "Thing deleted"});
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

    });
};

exports.requestFriend = (req, res) => {
    verifyToken(req, res, async () => {
        if (!req.body.username) {
            return res.status(404).send({
                message: "Request did not contain username"
            });
        }

        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.statue(404).send({
                message: "User not found"
            });
        }

        const requester = await User.findOne(
            {
                where: {
                    id: req.userId
                }
            }
        )
        
        user.addRequester(requester)
        .then(() => {
            res.status(200).send({message: "Friend request sent"});
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

    });
}

exports.addThingUserMap = (req, res) => {
    verifyToken(req, res, async() => {
        const thing = await Thing.findOne({
            where: {
                id: req.body.thingId
            }
        });
        if (!thing) {
            return res.status(404).send({
                message: "Thing not found"
            });
        }
        await Promise.all(req.body.friendList.map(user => thing.addUser(user.userId)))
        .then(() => {
            res.status(200).send({ message: 'User successfully associated with thing' });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    });
}


exports.acceptFriend = (req, res) => {
    verifyToken(req, res, async () => {
        const user = await User.findOne({
            where: {
                id: req.userId
            }
        });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (!req.body.username) {
            return res.status(404).send({
                message: "Request did not contain username"
            });
        }

        const requester = await user.getRequester({
            where: {
                username: req.body.username
            }
        });

        user.addFriend(requester)
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

        user.removeRequester(requester)
        .then(res.status(200).send({message: "Friend request accepted"}))
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

    });
}

exports.listRequests = (req, res) => {
    verifyToken(req, res, async () => {
        const thisUser = await User.findOne({
            where: {
                id: req.userId
            }
        });

        if (!thisUser) {
            return res.statue(404).send({
                message: "User not found"
            });
        }

        thisUser.getRequester({
            attributes: ['username'],
            joinTableAttributes: []
        })
        .then(requesters => {
            res.status(200).send(requesters);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

    });
}

exports.listFriends = (req, res) => {
    verifyToken(req, res, async () => {
        const thisUser = await User.findOne({
            where: {
                id: req.userId
            }
        });

        if (!thisUser) {
            return res.statue(404).send({
                message: "User not found"
            });
        }

        thisUser.getFriend({
            attributes: ['username', 'id'],
            joinTableAttributes: []
        })
        .then(friends => {
            res.status(200).send(friends);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    });
}

exports.suggestTime = (req, res) => {
    verifyToken(req, res, async () => {
        const thisUser = await User.findOne({
            where: {
                id: req.userId
            }
        });

        if (!req.body.userList || !req.body.tag || !req.body.startDate || !req.body.endDate) {
            return res.status(400).send({
                message: "Request missing parameters"
            });
        }

        const userList = req.body.userList;

        // If the user does not exist, send an error
        if (!thisUser) {
            return res.statue(404).send({
                message: "User not found"
            });
        }

        // Get list of the user's friends
        const friends = await thisUser.getFriend({
            attributes: ['username'],
            joinTableAttributes: []
        });

        // Send an error message if not all users are friends of the user making the suggestion request
        for (let i = 0; i < userList.length; i++) {
            let username = userList[i];
            if (!friends.some(friend => friend.username === username)) {
                return res.status(403).send({
                    message: "All users must be friends of the requester"
                });
            }
        }

        userList.append(thisUser.username);

        try {
            const suggestion = algorithm(userList, req.body.startDate, req.body.endDate, req.body.tag);
        } catch(err) {
            console.log(err);
        }
        
        if (suggestion === null) {
            return res.status(200).send();
        } else {
            return res.status(200).send(suggestion);
        }
    });
}
