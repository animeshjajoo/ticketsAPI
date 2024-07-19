const { DataTypes } = require("sequelize");
// const { roles } = require("../../config");

const VenueModel = {
  venueID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  timings: {
    type: DataTypes.ARRAY,
    defaultValue: [0,0,0,0,0,0,0,0,0,0,0,0],
  },
};

let Venue;

module.exports = {
  initialise: (sequelize) => {
    Venue = sequelize.define("venue", VenueModel);
  },
  getVenueModel: () => Venue,
};

