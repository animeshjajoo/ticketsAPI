const { DataTypes } = require("sequelize");
// const { roles } = require("../../config");

const TicketModel = {
  ticketID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  venueID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

let Ticket;
module.exports = {
  initialise: (sequelize) => {
    Ticket = sequelize.define("ticket", TicketModel);
  },
  getTicketModel: () => Ticket,
};