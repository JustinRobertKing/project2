'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    bio: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};