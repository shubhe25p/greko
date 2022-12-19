const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        return res.status(403).send({
            message: "No auth token"
        });
    }

    jwt.verify(token, config.secrets, (err, decoded) => {

        if(err){
            return res.status(401).send({
                message: "Unauthorized access stop here!"
            })
        }
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
}

module.exports = authJwt;