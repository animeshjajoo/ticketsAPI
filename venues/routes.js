const express = require('express');
const router = express.Router();

const { getEventModel } = require('../common/models/Event');
const { getVenueModel } = require('../common/models/Venue');
const { getTicketModel } = require('../common/models/Ticket');

function checkTimings(arr1, arr2){

    for (let i = 0; i < arr1.length; i++) {
        if (arr[i] == 1 && arr2[i] != 0) {
          return false; // new venue not free for event in old venue
        }
    }

    return true;
}

function updateTimings(arr1, arr2){
    for (let i = 0; i < arr1.length; i++) {
        if (arr[i] == 1) {
          arr2[i] = 1;
        }
    }

    return arr2;
}

//Post
// venue id random
router.post('/', async (req, res) => {
    const data = {
        venueID: req.body.venueID 
    }
    try {
        const Venue = getVenueModel();
        const dataToSave = await Venue.create(data);
        res.status(200).json(dataToSave);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Get All
router.get('/all', async (req, res) => {
    try {
        const Venue = getVenueModel();
        console.log(Venue);

        const data = await Venue.findAll();
        console.log(Venue);

        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID 
router.get('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();
        const data = await Venue.findByPk(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update Venue
// req id -> old venue
// req body -> new venue
router.put('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();

        const old_venue_data = await Venue.findByPk(req.params.id)
        if (!old_venue_data) {
            res.status(404).json({ message: "Venue not found" });
        } 
        const venue_data = await Venue.findByPk(req.body.venueID);
        if(!venue_data){
            res.status(404).json({ message: "New Venue not found" });
        }

        const old_timings = old_venue_data.timings || [];
        if (!Array.isArray(old_timings)) {
            old_timings = JSON.parse(old_timings);
        }
        if (!Array.isArray(old_timings)) {
            res.status(400).json({ message: 'Invalid timings array' });
        }

        const timings = venue_data.timings || [];
        if (!Array.isArray(timings)) {
            timings = JSON.parse(timings);
        }
        if (!Array.isArray(timings)) {
            res.status(400).json({ message: 'Invalid timings array' });
        }

        // update only if venue is free
        if(checkTimings(old_timings, timings)){

            const newTimings = updateTimings(old_timings,timings);
            const updatedData = {
                venueID: req.body.venueID,
                timings: newTimings
            }

            const cnt = await Venue.update(updatedData, {
            where: { venueID: req.body.venueID},
            returning: true,
            });

            // events update karna, tickets update karna
            // transaction rollback -> syntax

            for(let i = 0; i< old_venue_data.timings.length; i++){
                old_venue_data.timings[i] = 0;
            }
            await old_venue_data.save();

            const data = await Venue.findByPk(req.body.venueID);
            res.json(data)
        }
        else{
            res.status(404).json({ message: "Venue not available" });
        }
      } 
      catch (error) {
        res.status(500).json({ message: error.message });
      }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();
        const id = req.params.id;
        const Event = getEventModel();
        const Ticket = getTicketModel();
        const data = await Venue.findByPk(id);
        if(data){
            await Venue.destroy({ where: { venueID: id } });
            await Event.destroy({ where: { venueID: id } });
            await Ticket.destroy({ where: { venueID: id } });
            res.send(`Venue with id ${data.venueID} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "Venue not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;