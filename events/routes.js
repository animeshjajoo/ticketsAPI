const express = require('express');
const router = express.Router();

const { getEventModel } = require('../common/models/Event');

//Post
router.post('/', async (req, res) => {
    const data = {
        eventID: req.body.eventID,
        eventName: req.body.eventName,
        venueID: req.body.venueID,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        totalTickets: req.body.totalTickets,
        ticketsSold: req.body.ticketsSold
    }

    try {
        const Event = getUserModel();
        const dataToSave = await Event.create(data);
        res.status(200).json(dataToSave);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})


module.exports = router;