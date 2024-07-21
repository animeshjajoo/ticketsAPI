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

    // add logic for venue clashes
    try {
        const Event = getEventModel();
        const dataToSave = await Event.create(data);
        res.status(200).json(dataToSave);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Get All
router.get('/all', async (req, res) => {
    try {
        const Event = getEventModel();
        console.log(Event);

        const data = await Event.findAll();
        console.log(Event);

        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID 
router.get('/:id', async (req, res) => {
    try {
        const Event = getEventModel();
        const data = await Event.findByPk(req.params.eventID);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// need to add -> only update if schedule/venue is free at updated time
// Update


// Delete
router.delete('/:id', async (req, res) => {
    try {
        const Event = getEventModel();
        const id = req.params.id;
        const data = await User.findByPk(eventID)
        if(data){
            await User.destroy({ where: { id } });
            res.send(`Event with id ${data.eventID}:${data.eventName} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;