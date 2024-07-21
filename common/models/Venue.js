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
    defaultValue: new Array(12).fill(0),
  },
};

let Venue;

module.exports = {
  initialise: (sequelize) => {
    Venue = sequelize.define("venue", VenueModel);
  },
  getVenueModel: () => Venue,
};

/*
users: cannot buy more than max tickets, delete tickets bought when del user
venue: venue shifting, delete events when deleting venue and then delete tickets
events: book only if venue is free (0), delete tickets when deleting event 


assumptions: every user buys 1 ticket at a time, unit of time = 1hr, venue open for 12 hrs
*/