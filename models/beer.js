'use strict';
module.exports = (sequelize, DataTypes) => {
  const beer = sequelize.define('beer', {
    apiId: DataTypes.STRING,
    name: DataTypes.STRING,
    style: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    ibu: DataTypes.DECIMAL,
    abv: DataTypes.DECIMAL,
    availability: DataTypes.STRING,
    breweryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  beer.associate = function(models) {
    // associations can be defined here
  };
  return beer;
};