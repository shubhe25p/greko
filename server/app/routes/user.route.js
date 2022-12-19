const { authJwt } = require("../middleware");
const controller = require("../controller/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/home/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.post(
    "/api/thing/add",
    [authJwt.verifyToken],
    controller.addThing
  );

  app.post(
    "/api/thing/update",
    [authJwt.verifyToken],
    controller.updateThing
  );

  app.post(
    "/api/thing/delete",
    [authJwt.verifyToken],
    controller.deleteThing
  );
  
  app.get(
    "/api/friends/list",
    [authJwt.verifyToken],
    controller.listFriends
  );

  app.get(
    "/api/friends/listrequests",
    [authJwt.verifyToken],
    controller.listRequests
  );

  app.post(
    "/api/friends/request",
    [authJwt.verifyToken],
    controller.requestFriend
  );

  app.post(
    "/api/friends/accept",
    [authJwt.verifyToken],
    controller.acceptFriend
  );

  app.post(
    "/api/thing/suggesttime",
    [authJwt.verifyToken],
    controller.suggestTime
  );

  app.post(
    "/api/thing/createFriendMap",
    [authJwt.verifyToken],
    controller.addThingUserMap
  )
};