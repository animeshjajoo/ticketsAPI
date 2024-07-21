const express = require('express');
const router = express.Router();

const { getVenueModel } = require('../common/models/Venue');

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

module.exports = router;
