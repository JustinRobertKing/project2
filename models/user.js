'use strict';

let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your first name'
        }
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 32],
          msg: 'Your password must be between 8 and 32 characters'
        }
      }
    },
    birthdate: DataTypes.DATE,
    bio: DataTypes.TEXT,
    image: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: {
          msg: 'Please enter a valid URL'
        }
      }
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    facebookId: DataTypes.STRING,
    facebookToken: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (pendingUser) => {
        if (pendingUser && pendingUser.password) {
          // hash the password before it goes into user table
          let hash = bcrypt.hashSync(pendingUser.password, 12)

          // Reassign the password to the hashed value
          pendingUser.password = hash
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.hasMany(models.brewery)
    models.user.hasMany(models.beer)
  };

  user.prototype.validPassword = function(typedPassword) {
    return bcrypt.compareSync(typedPassword, this.password)
  }

  return user;
};