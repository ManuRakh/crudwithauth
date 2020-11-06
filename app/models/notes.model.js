module.exports = (sequelize, Sequelize) => {
    const Notes = sequelize.define("notes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      definition:{
        type: Sequelize.STRING
      },
      user_id:{
        type: Sequelize.INTEGER
      }
    });
  
    return Notes;
  };
  