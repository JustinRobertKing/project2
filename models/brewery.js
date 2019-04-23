'use strict';
module.exports = (sequelize, DataTypes) => {
  const brewery = sequelize.define('brewery', {
    apiId: DataTypes.STRING,
    name: DataTypes.STRING,
    established: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    long: DataTypes.DECIMAL,
    lat: DataTypes.DECIMAL,
    website: DataTypes.STRING,
    description: DataTypes.TEXT,
    isInBusiness: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  brewery.associate = function(models) {
    // associations can be defined here
  };
  return brewery;
};