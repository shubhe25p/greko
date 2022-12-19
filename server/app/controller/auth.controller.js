const db = require('../models');
const config = require('../config/auth.config')
const User = db.user;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { verifyToken } = require('../middleware/authJwt');

exports.signup = (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)

    }).then(user => {
        // console.log(user);
        res.send({
            message: "User create successful"
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if(!user){
            return res.status(404).send({
                message: "User not found"
            });
        }

        var passwordValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordValid){
            return res.status(401).send({
                message: "Password invalid"
            });
        }

        var token = jwt.sign({
            id: user.id,
        }, config.secrets, {
            expiresIn: 86400
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token,
        });

    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};