const express = require('express')
const app = express()

// const cors = require("cors"); // cross origin resource sharing
// const morgan = require("morgan"); // morgan middleware

const { Sequelize } = require("sequelize"); //db

const PORT = process.env.PORT || 3000;

// Express Routes Import
const UserRoutes = require("./users/routes");
const EventRoutes = require("./events/routes");
const VenueRoutes = require("./venues/routes");

// app.use(morgan("tiny"));
// app.use(cors());

app.use(express.json()); // parses json, parsed data av in req.body

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./storage/data.db",
  });

// Sequelize model imports

// const UserModel = require("./common/models/User");
// UserModel.initialise(sequelize);

// console.log(UserModel.getUserModel());

sequelize
  .sync()
  .then(() => {
    console.log("Sequelize Initialised!");

    const UserModel = require("./common/models/User");
    UserModel.initialise(sequelize);
    console.log(UserModel.getUserModel());

    const EventModel = require("./common/models/Event");
    EventModel.initialise(sequelize);
    console.log(EventModel.getEventModel());

    const VenueModel = require("./common/models/Venue");
    VenueModel.initialise(sequelize);
    console.log(VenueModel.getVenueModel());

    // Attaching the Authentication and User Routes to the app.
    // app.use("/", AuthorizationRoutes);
    app.use("/user", UserRoutes);
    app.use("/event", EventRoutes);
    app.use("/venue", VenueRoutes);

    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
    });
  })
  .catch((error) => {
    console.error("Sequelize Initialisation threw an error:", error);
  });

app.get('/', (req, res) => {
    res.send('Hello, World!');
  }); 
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });