const { DataTypes } = require("sequelize");
// const { roles } = require("../../config");

const UserModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isPositive(value) {
        if (value <= 17) {
          throw new Error('Kindly ask an adult to register for you');
        }
      },
    },
  },
};

let User;

module.exports = {
  initialise: (sequelize) => {
    User = sequelize.define("user", UserModel);
    // this.model = sequelize.define("user", UserModel);
  },
  getUserModel: () => User,
};