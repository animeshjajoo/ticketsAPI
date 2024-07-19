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