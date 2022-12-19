module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });

    User.belongsToMany(User, {as: 'requester', through: 'friend_requests'});
    User.belongsToMany(User, {as: 'friend', through: 'friends'});

    return User;
  };