const { DataTypes } = require("sequelize");
// const { roles } = require("../../config");

const EventModel = {
  eventID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  venueID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalTickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ticketsSold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
};

let Event;

module.exports = {
  initialise: (sequelize) => {
    Event = sequelize.define("event", EventModel);
  },
  getEventModel: () => Event,
};