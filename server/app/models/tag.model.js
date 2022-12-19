module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define("tags", {
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
      }
    });
  
    return Tag;
  };