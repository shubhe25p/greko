module.exports = (sequelize, Sequelize) => {
    const Thing = sequelize.define("things", {
      name: {
        type: Sequelize.STRING
      },
      starttime: {
        type: Sequelize.DATE
      },
      endtime: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.INTEGER
      }
    });
  
    return Thing;
  };